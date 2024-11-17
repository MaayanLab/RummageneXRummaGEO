PYTHONPATH=populate_db python3 -m helper ingest -i data/top_1million.csv
PYTHONPATH=populate_db python3 -m helper ingest-paper-info
PYTHONPATH=populate_db python3 -m helper ingest-gene-info
PYTHONPATH=populate_db python3 -m helper ingest-gse-info --species human
PYTHONPATH=populate_db python3 -m helper ingest-gse-info --species mouse
PYTHONPATH=populate_db python3 -m helper update-background