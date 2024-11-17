import click
from pathlib import Path
from tqdm import tqdm
from helper.cli import cli
from helper.utils import copy_from_records
import csv
import json
import uuid

def import_gene_set_library(
    plpy,
    library: Path | str,
    prefix='',
    postfix='',
):
    import re
    import uuid
    with open("data/data_hyp.json" ,"r") as f:
        gse_sum= json.load(f)
    # Fetch the gene_set, gather the background genes
    background_genes = set()
    n_geneset_genes = 0

    batch_size = 100000
    current_batch = []

    with Path(library).open('r') as fr:
        reader = csv.DictReader(fr)

        # Initialize a counter for the number of processed rows
        row_counter = 0

        for row in tqdm(reader, desc="Loading genesets..."):
            row_counter += 1
            term = row["rummagene"] + ";" + row["rummageo"]
            description = row["rummagene-desc"]
            species = row["species"]
            rummagene_size = int(float(row["rummagene-size"]))
            rummageo_size = int(float(row["rummageo-size"]))
            rummagene = term.split(";")[0]
            rummageo = term.split(";")[1]
            gse = rummageo.split("-")[0]
            pmc = rummagene.split("-")[0]
            raw_genes = row["overlaps"].split(";")
            odds = float(row["odds"])
            pval = float(row["p-value"])
            if term in gse_sum:
                hypothesis = gse_sum[term]
            else:
                hypothesis = None
            # print(row)
            # print(hypothesis)
            # print(dfljdfdjlfld)

            genes = [
                cleaned_gene
                for raw_gene in map(str.strip, raw_genes)
                if raw_gene
                for cleaned_gene in (re.split(r'[;,:\s]', raw_gene)[0],)
                if cleaned_gene
            ]

            current_batch.append(dict(
                term=prefix + term + postfix,
                description=description.split(";")[0],
                genes=genes,
                hash=uuid.uuid5(uuid.UUID('00000000-0000-0000-0000-000000000000'), '\t'.join(sorted(set(genes)))),
                species=species,
                rummagene=rummagene,
                rummageo=rummageo,
                gse=gse,
                pmc=pmc,
                rummagene_size=rummagene_size,
                rummageo_size=rummageo_size,
                pvalue=pval,
                hypothesis=hypothesis,
                odds=odds
            ))
            background_genes.update(genes)
            n_geneset_genes += len(genes)
            row_counter += 1

            # Process the current batch if it reaches the defined batch size
            if len(current_batch) >= batch_size:

                process_batch(plpy, current_batch, background_genes)
                current_batch = []  # Reset current batch after processing

                # print(dfljdfdjlfld)

        # Process any remaining records in the last batch
        if current_batch:
            process_batch(plpy, current_batch, background_genes)

    # Refresh materialized views
    plpy.execute('refresh materialized view concurrently app_public_v2.gene_set_pmc', [])
    plpy.execute('refresh materialized view concurrently app_public_v2.gene_set_gse', [])
    plpy.execute('REFRESH MATERIALIZED VIEW app_public_v2.unique_term_counts', [])
    plpy.execute('REFRESH MATERIALIZED VIEW app_public_v2.gse_stats', [])
    plpy.execute('REFRESH MATERIALIZED VIEW app_public_v2.pmc_term_stats', [])
    plpy.execute('REFRESH MATERIALIZED VIEW app_public_v2.ranked_gene_sets', [])

    


def process_batch(plpy, batch, background_genes):
    # get a mapping from background_genes to background_gene_ids
    gene_map, = plpy.cursor(
        plpy.prepare(
            '''
            select coalesce(jsonb_object_agg(g.gene, g.gene_id), '{}') as gene_map
            from app_public_v2.gene_map($1) as g
            ''',
            ['varchar[]']
        ),
        [list(background_genes)]
    )
    gene_map = json.loads(gene_map['gene_map'])

    # upsert any new genes not in the mapping & add them to the mapping
    new_genes = {
        id: dict(id=id, symbol=gene)
        for gene in tqdm(background_genes - gene_map.keys(), desc='Preparing new genes...')
        for id in (str(uuid.uuid4()),)
    }
    if new_genes:
        copy_from_records(
            plpy.conn, 'app_public_v2.gene', ('id', 'symbol',),
            tqdm(new_genes.values(), desc='Inserting new genes...'))
        gene_map.update({
            new_gene['symbol']: new_gene['id']
            for new_gene in new_genes.values()
        })

    existing = {
        (row['term'], row['description'], row['hash'])
        for row in plpy.cursor('select term, description, hash from app_public_v2.gene_set', tuple())
    }

    # Prepare records for insertion from the current batch
    records_to_insert = [
        dict(
            term=gene_set['term'],
            description=gene_set['description'],
            hash=gene_set['hash'],
            gene_ids=json.dumps({gene_map[gene]: position for position, gene in enumerate(gene_set['genes'])}),
            n_gene_ids=len(gene_set['genes']),
            species=gene_set['species'],
            gse=gene_set["gse"],
            pmc=gene_set["pmc"],
            pvalue=gene_set["pvalue"],
            rummagene_size=gene_set["rummagene_size"],
            rummageo_size=gene_set["rummageo_size"],
            hypothesis=gene_set["hypothesis"],
            odds=gene_set["odds"]
        )
        for gene_set in batch
        if (gene_set['term'], gene_set['description'], gene_set['hash']) not in existing
    ]

    # Insert records for the current batch
    copy_from_records(
        plpy.conn, 'app_public_v2.gene_set', ('term', 'description', 'hash', 'gene_ids', 'n_gene_ids', 'species', "gse", "pmc", "rummagene_size", "rummageo_size", "pvalue", "hypothesis", "odds"),
        tqdm(records_to_insert, desc='Inserting gene sets...')
    )





@cli.command()
@click.option('-i', '--input', type=click.Path(exists=True, file_okay=True, path_type=Path), help='GMT file to ingest')
@click.option('--prefix', type=str, default='', help='Prefix to add to terms')
@click.option('--postfix', type=str, default='', help='Postfix to add to terms')
# @click.option('--species', type=str, default='human', help='Species for gene sets')
def ingest(input, prefix, postfix):
  from helper.plpy import plpy

  
  try:
    # import_gene_set_library(plpy, input, prefix=prefix, postfix=postfix, species=species)
      import_gene_set_library(plpy, input, prefix=prefix, postfix=postfix)

    # write_view_info_to_file()
  except:
    plpy.conn.rollback()
    raise
  else:
    plpy.conn.commit()