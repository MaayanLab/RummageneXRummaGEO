

### Set up
To cross Rummagene file with human RummaGEO files 
Create virtual environment and activate like in the main README
```bash
source myvenv/bin/activate
pip install -r create_files/requirements.txt
cd create_files
```

### Running files
```bash

mkdir data
cd data
curl -O https://rummagene.com/latest.gmt   #rummagene.gmt
curl -O https://s3.amazonaws.com/maayanlab-public/rummageo/human-geo-auto.gmt.gz
curl -O https://s3.amazonaws.com/maayanlab-public/rummageo/mouse-geo-auto.gmt.gz
jupyter nbconvert --to notebook --inplace --execute rummageogene.ipynb #to create rummagenexrummageo.csv.gz
jupyter nbconvert --to notebook --inplace --execute cleaning_up_csv.ipynb # to remove cases where the rummagene and rummageo share pmids
```
Keep in mind that the crossing can happen over the course of a week but you can edit the number of batches etc. that run at a time.
