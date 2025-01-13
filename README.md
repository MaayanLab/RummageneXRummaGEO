### Development
Rather than splitting up the meta and data APIs, all functionality is incorporated into a postgres database.

We use postgraphile to serve the database on a graphql endpoint -- this endpoint can then be used for all necessary functionality, including both metadata search, filtering, and enrichment analysis. For speed purposes, enrichment is done through a companion API written in rust, the database itself communicates with this API, it is transparent to the application or users of the database.



### Usage
```bash
# prepare environment variables
cp .env.example .env
# start db
docker-compose up -d rummagenexrummageo-postgres

# create db/ensure it's fully migratedddd
dbmate up

# start companion API
docker-compose up -d rummagenexrummageo-enrich

# start app (production)
docker-compose up -d rummagenexrummageo-app
# start app (development)
npm run dev
```

### Provisioning
```bash

#make sure you are using python 3.10 or above

mkdir -p data
cd data
curl -O https://s3.dev.maayanlab.cloud/rummageogene/data_hyp.json
curl -O https://s3.dev.maayanlab.cloud/rummageogene/data_enrichr2.json
curl -O https://s3.dev.maayanlab.cloud/rummageogene/gse_results.json
curl -O https://s3.dev.maayanlab.cloud/rummageogene/title_abs.json
curl -O https://s3.dev.maayanlab.cloud/rummageogene/rummagenexrummageo.csv.gz
curl -O https://s3.dev.maayanlab.cloud/rummageogene/top_1million.csv
gunzip rummagenexrummageo.csv.gz
cd ..

python3 -m venv myvenv
source myvenv/bin/activate
pip install -r populate_db/requirements.txt

#You can also run populate.sh for the following commands
PYTHONPATH=populate_db python3 -m helper ingest -i data/top_1million.csv
PYTHONPATH=populate_db python3 -m helper ingest-paper-info
PYTHONPATH=populate_db python3 -m helper ingest-gene-info
PYTHONPATH=populate_db python3 -m helper ingest-gse-info --species human
PYTHONPATH=populate_db python3 -m helper ingest-gse-info --species mouse
PYTHONPATH=populate_db python3 -m helper update-background


```

### Writing Queries
See `src/graphql/core.graphql`
These can be tested/developed at <http://localhost:3000/graphiql>

### Recreating files
Check the create_files directory