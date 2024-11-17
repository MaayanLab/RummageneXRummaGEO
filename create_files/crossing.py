import os
import time
import gzip
import requests
import pandas as pd
from tqdm import tqdm
from csv import DictWriter
from maayanlab_bioinformatics.harmonization import ncbi_genes_lookup
from pyenrichr_mod import FastFisher, fisher

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
        # Determine file mode based on the file extension
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
                    # Write to CSV file
                    writer.writerow({'identifier': identifier, 'desc': desc, 'genes': ";".join(genes)})
    return f"{name} done"


def cross_GMTs(main_dict, desc_dict, crossSets, name, record):
    start_time = time.time()
    fish = FastFisher(23000)
    if len(main_dict) == 0:
        return 
    fisher_result = fisher(main_dict, crossSets, uppercase=False, min_overlap=5, fisher=fish)
    print("fisher done running")

    r = set(main_dict.keys())
    for ele in r:
        with open(record, 'a') as file:
            file.write(f"{ele}\n")  
    if len(fisher_result) == 0:
        print ("0 fisher")
        return
    elapsed_time = time.time() - start_time
    print(f"fisher:  {int(elapsed_time // 3600)}hr, {int((elapsed_time % 3600) // 60)}min, {int(elapsed_time % 60)}sec")
    fisher_result["overlaps"] = fisher_result.apply(lambda row: ";".join(main_dict[row["rummagene"]] & crossSets[row["rummageo"]]), axis=1)
    fisher_result["rummagene-desc"] = fisher_result.apply(lambda row: desc_dict[row["rummagene"]], axis=1)
    fisher_result = fisher_result[['rummagene', 'rummageo', 'rummagene-desc', 'p-value', 'sidak', 'fdr', 'odds', 'n-overlap', 'rummagene-size', 'rummageo-size','overlaps']]
    write_to_csv(fisher_result, f"{name}.csv")
    elapsed_time = time.time() - start_time
    print(f"printed:  {int(elapsed_time // 3600)}hr, {int((elapsed_time % 3600) // 60)}min, {int(elapsed_time % 60)}sec")
    return 



