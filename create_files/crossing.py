import os
import gzip
import requests
import pandas as pd
import numpy as np
from tqdm import tqdm
from csv import DictWriter
from maayanlab_bioinformatics.harmonization import ncbi_genes_lookup
from pyenrichr.enrichment import FastFisher, fisher

def is_file_empty(filename):
    """Check if the given file is empty."""
    if not os.path.isfile(filename):
        open(filename, 'w').close()  
    if os.path.getsize(filename) == 0:
        return True
    return False


def write_to_csv(df, file_path):
    df.to_csv(file_path, mode='a', header=is_file_empty(file_path), index=False)

def preprop_GMTs(gmt, name):
    with open(f"{name}.csv", 'w', newline='') as csvfile:
        fieldnames = ['identifier', 'desc', 'genes']
        writer = DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        # Lookup function for harmonizing
        lookup = ncbi_genes_lookup(organism='Mammalia/Homo_sapiens')
        if gmt.endswith('.gz'):
            open_func = gzip.open
            file_mode = 'rt'
        else:
            open_func = open
            file_mode = 'r'
        with open_func(gmt, file_mode) as f:
            for line in tqdm(f, desc='Processing lines'):
                parts = line.strip().split('\t')
                identifier, desc, *genes = parts
                genes = set(filter(None, genes))  # Remove empty genes
                genes = {lookup(gene.upper()) for gene in genes if lookup(gene.upper()) is not None} 
                desc = desc if len(desc) > 0 else "None here"
                if genes:
                    writer.writerow({'identifier': identifier, 'desc': desc, 'genes': ";".join(genes)})
    return f"{name} done"


def cross_GMTs(main_dict, desc_dict, crossSets, name, record):
    fish = FastFisher(23000)
    if len(main_dict) == 0:
        return 
    fisher_dict = fisher(main_dict, crossSets, uppercase=False, min_overlap=5, fisher=fish)
    fisher_result = pd.DataFrame()
    for rummagene in tqdm(fisher_dict, desc="Processing Fisher results"):
        df = fisher_dict[rummagene]
        df["rummagene"] = [rummagene for ele in range(len(df))]
        df['rummagene-size'] = [len(main_dict[rummagene]) for ele in range(len(df))]
        df = df.rename(columns={"term": "rummageo", "set-size": "rummageo-size", "overlap":"n-overlap"})
        df = df.loc[df['p-value'] <= 0.001]
        df.sort_values(by=["p-value", "odds"], ascending=[True, False], inplace=True)
        df = df.head(10)
        fisher_result = pd.concat([fisher_result, df], ignore_index=True)
    fisher_result["overlaps"] = fisher_result.apply(lambda row: ";".join(main_dict[row["rummagene"]] & crossSets[row["rummageo"]]), axis=1)
    fisher_result["rummagene-desc"] = fisher_result.apply(lambda row: desc_dict[row["rummagene"]], axis=1)
    fisher_result.sort_values(by=["p-value", "odds"], ascending=[True, False],inplace=True)
    fisher_result.index = np.arange(1, len(fisher_result.index)+1)


    rummagene = set(main_dict.keys())
    for ele in rummagene:
        with open(record, 'a') as file:
            file.write(f"{ele}\n")  
    if len(fisher_result) == 0:
        return

    fisher_result = fisher_result[['rummagene', 'rummageo', 'rummagene-desc', 'p-value', 'sidak', 'fdr', 'odds', 'n-overlap', 'rummagene-size', 'rummageo-size','overlaps']]
    write_to_csv(fisher_result, f"{name}.csv")
    return 



