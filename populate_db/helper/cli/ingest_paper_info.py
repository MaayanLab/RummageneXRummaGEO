import traceback
from tqdm import tqdm
from helper.cli import cli
from helper.utils import copy_from_records
import json

def import_paper_info(plpy):
  import pandas as pd
  import requests
  import re

  to_ingest = [
    r['pmc']
    for r in plpy.cursor(
      '''
        select pmc
        from app_public_v2.pmc
        where pmc not in (
          select pmc
          from app_public_v2.pmc_info
        )
      '''
    )
  ]
  print(f'Found {len(to_ingest)} new PMCs to ingest')

  if len(to_ingest) == 0:
    print("No PMCs to ingest, exiting function.")
    return "Done"
  to_ingest = list(set([ele.split(";")[0] for ele in to_ingest]))
  to_ingest = list(set([ele.split("-")[0] for ele in to_ingest]))
  # use information from bulk download metadata table (https://ftp.ncbi.nlm.nih.gov/pub/pmc/)
  pmc_meta = pd.read_csv('https://ftp.ncbi.nlm.nih.gov/pub/pmc/PMC-ids.csv.gz', usecols=['PMCID', 'Year', 'DOI'], index_col='PMCID', compression='gzip')
  print(pmc_meta.shape)
  pmc_meta = pmc_meta[pmc_meta.index.isin(to_ingest)]
  if pmc_meta.shape[0] == 0:
    return
  title_dict = {}
  abstract_dict = {}
  for i in tqdm(range(0, len(to_ingest), 250), 'Pulling titles...'):
    while True:
      j = 0
      try:
        k=[re.sub(r"^PMC(\d+)$", r"\1", id) for id in to_ingest[i:i+250]]
        ids_string = ",".join(k)
        res = requests.get(f'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pmc&retmode=json&id={ids_string}')
        ids_info = res.json()
        # for id in ids_info['result']['uids']:
        with open("data/title_abs.json", "r") as f:
          t = json.load(f)
        for id in k:
          try:
            title_dict[f"PMC{id}"] = ids_info['result'][id]['title']
            abstract_dict[f"PMC{id}"] = t[f"PMC{id}"]['abstract']
          except KeyError:
            pass
        break
      except KeyboardInterrupt:
        raise
      except Exception as e:
        traceback.print_exc()
        print('Error resolving info. Retrying...')
        j += 1
        if j >= 10:
          raise RuntimeError(f'Error connecting to E-utilites api...')

  if title_dict:
    copy_from_records(
      plpy.conn, 'app_public_v2.pmc_info', ('pmc', 'yr', 'doi', 'title', 'abstract'),
      tqdm((
        dict(
          pmc=pmc,
          yr=int(pmc_meta.at[pmc, 'Year']),
          doi=pmc_meta.at[pmc, 'DOI'],
          title=title_dict[pmc],
          abstract=abstract_dict[pmc]
        )
        for pmc in pmc_meta.index.values
        if pmc in title_dict
      ),
      total=len(title_dict),
      desc='Inserting PMC info..')
    )

@cli.command()
def ingest_paper_info():
  from helper.plpy import plpy
  try:
    import_paper_info(plpy)
  except:
    plpy.conn.rollback()
    raise
  else:
    plpy.conn.commit()
