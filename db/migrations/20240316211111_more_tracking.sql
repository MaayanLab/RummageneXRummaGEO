-- migrate:up

-- rummageo stats human and mouse
create materialized view app_public_v2.gse_stats as
select
    species,
    count(distinct gse || species) as n_occurrences_processed
from
    app_public_v2.gene_set
where
    species in ('human', 'mouse') 
group by
    species;
grant select on app_public_v2.gse_stats to guest;
grant all privileges on app_public_v2.gse_stats to authenticated;

-- unique rummagene sets
create materialized view app_public_v2.pmc_term_stats as
select
    count(distinct substring(term from '^(.+?);')) as unique_term_parts_count
from
    app_public_v2.gene_set;
grant select on app_public_v2.pmc_term_stats to guest;
grant all privileges on app_public_v2.pmc_term_stats to authenticated;

-- unique term sets
create materialized view app_public_v2.unique_term_counts as
select
    count(distinct term) as unique_term_count
from
    app_public_v2.gene_set;
grant select on app_public_v2.unique_term_counts to guest;
grant all privileges on app_public_v2.unique_term_counts to authenticated;

-- migrate:down
drop materialized view app_public_v2.gse_stats;
drop materialized view app_public_v2.pmc_term_stats;
drop materialized view app_public_v2.unique_term_counts;
