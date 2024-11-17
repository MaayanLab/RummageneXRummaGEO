
#!myvenv/bin/python

import traceback
from tqdm import tqdm
from helper.cli import cli
from helper.utils import copy_from_records
import click
import time
from concurrent.futures import ThreadPoolExecutor
import GEOparse
from itertools import chain
from pathlib import Path
import pandas as pd
import json
from datetime import datetime
import requests
import os


with open('data/gse_results.json', 'r') as f:
    gse_meta = json.load(f)


def fetch_gse(gse):
    """Fetch GSE data with retries."""
    lst = []
    if gse in lst:
        return gse, None
    
    if ',' in gse:
        gse_split = gse.split(',')[0]
    else:
        gse_split = gse

    for i in range(10):  # Retry up to 5 times
        try:
            # filepath = f'data/geo/{gse_split}.soft.gz'
            # if not os.path.exists(filepath):
            geo_meta = gse_meta[gse_split]
                # geo_meta = GEOparse.get_GEO(geo=gse_split, silent=True, destdir='data/geo')
            # else:
            #     # geo_meta = GEOparse.get_GEO(filepath=filepath)
            time.sleep(1)  # Adjust this based on response time
            if isinstance(geo_meta, str):
                raise Exception()
            return gse, geo_meta
        
        except Exception as e:
            print(f'Attempt {i + 1} failed to fetch {gse}: {e}')
            time.sleep(1)  # Adding a slight delay between retries
    return gse, None


def import_gse_info(plpy, species):
    # Refresh materialized views
    plpy.execute('refresh materialized view app_public_v2.gene_set_gse;')
    plpy.execute('refresh materialized view app_public_v2.gene_set_pmid;', [])

    # Get GSEs to ingest
    to_ingest = [
        r['gse'] for r in plpy.cursor(
            f'''
            select gse, species
            from app_public_v2.gene_set_gse
            where gse not in (
                select gse
                from app_public_v2.gse_info
                where gse_info.species = '{species}'
            ) and species = '{species}'
            '''
        )
    ]
    print(f'Found {len(to_ingest)} new GSEs to ingest')
    if len(to_ingest) == 0:
        return

    to_ingest = list(set(to_ingest))
    print(f'Found {len(to_ingest)} new GSEs to ingest')

    # Fetch the metadata file
    url = f'https://s3.amazonaws.com/maayanlab-public/rummageo/{species}-gse-processed-meta.json'
    response = requests.get(url)

    if response.status_code == 200:
        with open(Path(f'data/{species}-gse-processed-meta.json'), 'wb') as file:
            file.write(response.content)
        print("File downloaded successfully.")
    else:
        print(f"Failed to download file. Status code: {response.status_code}")
        return

    # Load the metadata
    try:
        with open(f'data/{species}-gse-processed-meta.json') as f:
            gse_info = json.load(f)
    except:
        raise RuntimeError('Missing metadata. Please ensure path is correct.')

    os.makedirs(Path('data/geo'), exist_ok=True)

    # Process GSEs in batches with parallel fetching
    batch_size = 1000
    for batch_start in range(0, len(to_ingest), batch_size):
        batch = to_ingest[batch_start:batch_start + batch_size]
        print(f"Processing batch {batch_start // batch_size + 1}...")

        gse_info_to_ingest = {}
        samples_to_ingest = set()

        # Parallel fetching using ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=30) as executor:
            results = list(tqdm(executor.map(fetch_gse, batch), total=len(batch), desc='Fetching GSE info...'))

        for gse, geo_meta in results:
            if geo_meta is None:
                # Write failed GSE to a file and skip processing
                with open('data/GSE_to_delete.txt', 'a') as f:
                    f.write(f'{gse}\n')
                continue
           
            try:
                pm = geo_meta['pubmed_id'][0]
            except:
                pm = None

        
            gse_info_to_ingest[gse] = {
                'title': geo_meta['title'][0],
                'summary': geo_meta['summary'][0],
                'pmid': pm,
                'publication_date': datetime.strptime(geo_meta['status'][0], "Public on %b %d %Y").strftime("%Y-%m-%d"),
                'platform': geo_meta['platform_id'][0],
                'species': species,
                'sample_groups': {
                    "samples": gse_info[gse]['samples'],
                    "titles": gse_info[gse]['titles']
                },
                'silhouette_score': gse_info[gse]['silhouette_score']
            }
            
            del geo_meta

            samples = list(chain.from_iterable(gse_info[gse]['samples'].values()))
            samples_to_ingest.update(samples)

        # Fetch already ingested GSMs and filter samples to ingest
        gsms_ingested = [
            r['gsm'] for r in plpy.cursor('select gsm from app_public_v2.gsm_meta')
        ]

        samps_df = pd.read_csv(f'https://s3.amazonaws.com/maayanlab-public/rummageo/gse_gsm_meta_{species}.csv').set_index('gsm')
        samples_to_ingest = list(set(samples_to_ingest) - set(gsms_ingested))
        samps_df_to_ingest = samps_df.loc[list(set(samples_to_ingest).intersection(samps_df.index))]

        # Insert GSE info into the database
        copy_from_records(
            plpy.conn, 'app_public_v2.gse_info',
            ('gse', 'pmid', 'title', 'summary', 'published_date', 'species', 'platform', 'sample_groups', 'silhouette_score'),
            tqdm((
                dict(
                    gse=gse,
                    pmid=gse_info_to_ingest[gse]['pmid'],
                    title=gse_info_to_ingest[gse]['title'],
                    summary=gse_info_to_ingest[gse]['summary'],
                    published_date=gse_info_to_ingest[gse]['publication_date'],
                    species=species,
                    platform=gse_info_to_ingest[gse]['platform'],
                    sample_groups=json.dumps(gse_info_to_ingest[gse]['sample_groups']),
                    silhouette_score=gse_info_to_ingest[gse]['silhouette_score']
                )
                for gse in batch
                if gse in gse_info_to_ingest
            ), total=len(batch), desc='Inserting GSE info...')
        )

        # Insert GSM info into the database
        copy_from_records(
            plpy.conn, 'app_public_v2.gsm_meta',
            ('gsm', 'gse', 'title', 'characteristics_ch1', 'source_name_ch1'),
            tqdm((
                dict(
                    gsm=gsm,
                    gse=row['gse'],
                    title=row['title'],
                    characteristics_ch1=row['characteristics_ch1'],
                    source_name_ch1=row['source_name_ch1']
                )
                for gsm, row in samps_df_to_ingest.iterrows()
            ), total=len(samps_df_to_ingest), desc='Inserting GSM info...')
        )

    # Refresh materialized views after all processing is complete
    plpy.execute('refresh materialized view app_public_v2.gene_set_pmid;', [])
    plpy.execute('refresh materialized view app_public_v2.gene_set_gse;', [])


@cli.command()
@click.option('--species', default='human', help='Species to filter data by')
def ingest_gse_info(species):
    from helper.plpy import plpy
    try:
        import_gse_info(plpy, species)
    except:
        plpy.conn.rollback()
        raise
    else:
        plpy.conn.commit()
