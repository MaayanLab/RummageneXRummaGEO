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
    """takes gmt file name and name of output csv filename, and performs harmonization on the genes to create a csv with cleaned genes"""
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
    """takes a dictionary(main_dict) mapped rummagene identifiers to genes and another which maps rummagene identifiers to table description and crosses with entire rummageo library (crossSets which maps rummageo identifiers to their genes).
    Records the rummagene identifiers to avoid rerunning and stores results in output csv
    """
    if len(main_dict) == 0:
        return 
    fisher_dict = fisher(main_dict, crossSets, uppercase=False, min_overlap=5)
    results = [] 
    for rummagene in tqdm(fisher_dict, desc="Processing Fisher results"):
        df = fisher_dict[rummagene]
        df["rummagene"] = rummagene
        df['rummagene-size'] = len(main_dict[rummagene])
        df = df.rename(columns={"term": "rummageo", "set-size": "rummageo-size", "overlap":"n-overlap"})
        df = df.loc[df['p-value'] <= 0.001]
        df.sort_values(by=["p-value", "odds"], ascending=[True, False], inplace=True)
        df = df.head(10)
        results.append(df)
    if not results:  # If no results found
        with open(record, 'a') as file:
            file.writelines(f"{rummagene}\n" for rummagene in main_dict.keys())
        print("None found")
        return
    fisher_result = pd.concat(results, ignore_index=True)
    overlaps = []
    for index, row in fisher_result.iterrows():
        overlaps.append(";".join(main_dict[row["rummagene"]] & crossSets[row["rummageo"]]))
    fisher_result["overlaps"] = overlaps
    fisher_result["rummagene-desc"] = fisher_result["rummagene"].map(desc_dict)
    fisher_result.sort_values(by=["p-value", "odds"], ascending=[True, False],inplace=True)
    fisher_result.index = np.arange(1, len(fisher_result.index)+1)
    fisher_result = fisher_result[['rummagene', 'rummageo', 'rummagene-desc', 'p-value', 'sidak', 'fdr', 'odds', 'n-overlap', 'rummagene-size', 'rummageo-size','overlaps']]
    write_to_csv(fisher_result, f"{name}.csv")
    with open(record, 'a') as file:
        file.writelines(f"{rummagene}\n" for rummagene in main_dict.keys())
    return 



def cross_GMTs_rummageo_first(main_dict, desc_dict, crossSets, name, record):
    """takes a dictionary(main_dict) mapped rummagene identifiers to genes and another which maps rummagene identifiers to table description and crosses with entire rummageo library (crossSets which maps rummageo identifiers to their genes).
    Records the rummagene identifiers to avoid rerunning and stores results in output csv
    """
    if len(main_dict) == 0:
        return 
    fisher_dict = fisher(main_dict, crossSets, uppercase=False, min_overlap=5)
    results = [] 
    for rummageo in tqdm(fisher_dict, desc="Processing Fisher results"):
        df = fisher_dict[rummageo]
        df["rummageo"] = rummageo
        df['rummageo-size'] = len(main_dict[rummageo])
        df = df.rename(columns={"term": "rummagene", "set-size": "rummagene-size", "overlap":"n-overlap"})
        df = df.loc[df['p-value'] <= 0.001]
        df.sort_values(by=["p-value", "odds"], ascending=[True, False], inplace=True)
        df = df.head(10)
        results.append(df)
    if not results:  # If no results found
        with open(record, 'a') as file:
            file.writelines(f"{rummageo}\n" for rummageo in main_dict.keys())
        print("None found")
        return
    fisher_result = pd.concat(results, ignore_index=True)
    overlaps = []
    for index, row in fisher_result.iterrows():
        overlaps.append(";".join(main_dict[row["rummageo"]] & crossSets[row["rummagene"]]))
    fisher_result["overlaps"] = overlaps
    fisher_result["rummagene-desc"] = fisher_result["rummagene"].map(desc_dict)
    fisher_result.sort_values(by=["p-value", "odds"], ascending=[True, False],inplace=True)
    fisher_result.index = np.arange(1, len(fisher_result.index)+1)
    fisher_result = fisher_result[['rummageo', 'rummagene', 'rummagene-desc', 'p-value', 'sidak', 'fdr', 'odds', 'n-overlap', 'rummagene-size', 'rummageo-size','overlaps']]
    write_to_csv(fisher_result, f"{name}.csv")
    with open(record, 'a') as file:
        file.writelines(f"{rummageo}\n" for rummageo in main_dict.keys())
    return 





