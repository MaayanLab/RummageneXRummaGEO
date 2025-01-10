--migrate:up
create extension if not exists "uuid-ossp";  
create extension if not exists "plpython3u"; 
create extension if not exists "pg_trgm";   

create schema app_public_v2;                 
create schema app_private_v2;               

create role guest nologin;                  
create role authenticated nologin;           
grant usage on schema app_public_v2 to guest, authenticated; 

create table app_public_v2.gene (
  id uuid primary key default uuid_generate_v4(),   
  symbol varchar not null unique,                   
  synonyms jsonb default '{}'::jsonb,               
  ncbi_gene_id integer,                             
  description varchar,                              
  summary text                                     
);
create index on app_public_v2.gene using gin (synonyms);    
grant select on table app_public_v2.gene to guest;          
grant all privileges on table app_public_v2.gene to authenticated; 

create table app_public_v2.gene_set (
  id uuid primary key default uuid_generate_v4(),          
  term varchar not null unique,                            
  gene_ids jsonb not null,                                 
  n_gene_ids int not null,                                 
  created timestamp not null default now(),               
  hash uuid not null,                                      
  description varchar,                                     
  species varchar not null,                                
  gse varchar,                                             
  pmc varchar,  
  hypothesis_title varchar,                                            
  hypothesis text,
  pvalue double precision,
  rummagene_size int,
  rummageo_size int,
  odds double precision,
  enrich_links varchar,
  hypothesis_rating float default 0,
  rating_counts int default 0
);
create index gene_set_gene_ids_idx on app_public_v2.gene_set using gin (gene_ids);   
create index gene_set_term_trgm_idx on app_public_v2.gene_set using gin (term gin_trgm_ops); 
create index gene_set_hash_idx on app_public_v2.gene_set (hash);                     
create index gene_set_gse_idx on app_public_v2.gene_set (gse);                       
create index gene_set_pmc_idx on app_public_v2.gene_set (pmc);                       
create index idx_gene_set_pvalue_odds on app_public_v2.gene_set (pvalue asc, odds desc);

grant select on table app_public_v2.gene_set to guest;                             
grant all privileges on table app_public_v2.gene_set to authenticated;              



create materialized view app_public_v2.ranked_gene_sets as
select 
    id,                  
    term,
    species,
    hypothesis,
    hypothesis_title,
    ROW_NUMBER() over (order by pvalue asc, odds desc) as rank
from 
    app_public_v2.gene_set
where 
    hypothesis is not null
order by
  pvalue asc, odds desc;

create unique index gene_set_id_rank_idx on app_public_v2.ranked_gene_sets (rank);
grant all privileges on app_public_v2.ranked_gene_sets to authenticated; 
comment on materialized view app_public_v2.ranked_gene_sets is E'@foreignKey (id) references app_public_v2.gene_set (id)';
grant select on table app_public_v2.ranked_gene_sets to guest;


create type app_public_v2.paginated_ranked_gene_sets_result as (
  ranked_sets app_public_v2.ranked_gene_sets[], 
  total_count int
);

create or replace function app_public_v2.get_paginated_ranked_gene_sets(
  p_limit int,
  p_offset int,
  p_term varchar default null,
  p_case_sensitive boolean default false,
  p_species varchar default null
) returns app_public_v2.paginated_ranked_gene_sets_result
as $$
declare
  total_count int;                                    
  paginated_results app_public_v2.ranked_gene_sets[]; 
begin
  select count(*)
  into total_count
  from app_public_v2.ranked_gene_sets
  where
    (p_term is null or p_term = '' or
     (case
        when p_case_sensitive then 
          term like '%' || p_term || '%' or hypothesis like '%' || p_term || '%'
        else 
          term ilike '%' || p_term || '%' or hypothesis ilike '%' || p_term || '%'
      end))
    and (p_species is null or p_species = '' or lower(species) = lower(p_species));

  select array(
    select row(
    id,                          
    term,                         
    species,                      
    hypothesis,                   
    hypothesis_title,            
    rank                          
)
    from app_public_v2.ranked_gene_sets
    where
      (p_term is null or p_term = '' or
       (case
          when p_case_sensitive then 
            term like '%' || p_term || '%' or hypothesis like '%' || p_term || '%'
          else 
            term ilike '%' || p_term || '%' or hypothesis ilike '%' || p_term || '%'
        end))
      and (p_species is null or p_species = '' or lower(species) = lower(p_species))
    order by rank
    limit p_limit offset p_offset
  ) into paginated_results;

  return (paginated_results, total_count);
end;
$$ language plpgsql immutable strict parallel safe;

grant execute on function app_public_v2.get_paginated_ranked_gene_sets to guest, authenticated;

create or replace function app_public_v2.update_hypothesis(
    p_id uuid,
    p_hypothesis varchar
) returns app_public_v2.gene_set as $$
begin
    update app_public_v2.gene_set
    set hypothesis = p_hypothesis
    where id = p_id;

    if not found then
        raise exception 'Gene set with ID % not found', p_id;
    end if;
end;
$$ language plpgsql;
grant execute on function app_public_v2.update_hypothesis to guest, authenticated;

create or replace function app_public_v2.update_ratings(
    p_id uuid,
    p_rating double precision
) returns app_public_v2.gene_set as $$
declare
    current_rating double precision;
    current_count int;
    new_rating double precision;
begin
    select hypothesis_rating, rating_counts
    into current_rating, current_count
    from app_public_v2.gene_set
    where id = p_id;

    if not found then
        raise exception 'Gene set with ID % not found', p_id;
    end if;
    new_rating := ((current_rating * current_count) + p_rating) / (current_count + 1);
    update app_public_v2.gene_set
    set
        hypothesis_rating = new_rating,
        rating_counts = rating_counts + 1
    where id = p_id;
    return (
        select * from app_public_v2.gene_set where id = p_id
    );
end;
$$ language plpgsql;

grant execute on function app_public_v2.update_ratings to guest, authenticated;


create table app_public_v2.background (
  id uuid primary key default uuid_generate_v4(),
  gene_ids jsonb not null,
  n_gene_ids int not null,
  created timestamp default now()
);
create index on app_public_v2.background using gin (gene_ids);                      
grant select on table app_public_v2.background to guest;                            
grant all privileges on table app_public_v2.background to authenticated;

create type app_public_v2.gene_mapping as (
  gene_id uuid,
  gene varchar
);

create or replace function app_public_v2.gene_map(genes varchar[])
returns setof app_public_v2.gene_mapping as $$
  select g.id as gene_id, ug.gene as gene
  from unnest(genes) ug(gene) 
  inner join app_public_v2.gene g on g.symbol = ug.gene or g.synonyms ? ug.gene;
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.gene_map to guest, authenticated;

create or replace function app_public_v2.gene_mapping_gene_info(gene_mapping app_public_v2.gene_mapping)
returns app_public_v2.gene as $$
  select *
  from app_public_v2.gene g
  where g.id = gene_mapping.gene_id
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.gene_mapping_gene_info to guest, authenticated;

create table app_public_v2.counter_table (
    id serial primary key,
    count integer default 0
);
grant select on table app_public_v2.counter_table to guest;
grant all privileges on table app_public_v2.counter_table to authenticated;    
insert into app_public_v2.counter_table (count) values (0);

create or replace function app_public_v2.increment_counter()
returns integer as $$
declare
    updated_count integer;
begin
    update app_public_v2.counter_table
    set count = count + 1
    where id = 1
    returning count into updated_count;
    
    return updated_count;
end;
$$ language plpgsql security definer;
grant select on app_public_v2.counter_table to guest, authenticated;
grant execute on function app_public_v2.increment_counter() to guest, authenticated;

create or replace function app_public_v2.background_overlap(
  background app_public_v2.background,
  genes varchar[],
  overlap_greater_than int default 0
) returns table (
  gene_set_id uuid,
  n_overlap_gene_ids int,
  n_gs_gene_ids int
) as $$
  select gs.id as gene_set_id, count(ig.gene_id) as n_overlap_gene_ids, gs.n_gene_ids as n_gs_gene_ids
  from (select distinct g.gene_id::text from app_public_v2.gene_map(genes) g) ig
  inner join app_public_v2.gene_set gs on gs.gene_ids ? ig.gene_id
  group by gs.id having count(ig.gene_id) > overlap_greater_than;
$$ language sql immutable strict;
grant execute on function app_public_v2.background_overlap to guest, authenticated;

--migrate:down
drop function if exists app_public_v2.update_ratings;
drop function if exists app_public_v2.background_overlap;
drop function if exists app_public_v2.increment_counter;
drop function if exists app_public_v2.gene_mapping_gene_info;
drop function if exists app_public_v2.gene_map;
drop function if exists app_public_v2.update_hypothesis;
drop function if exists app_public_v2.get_paginated_ranked_gene_sets;

drop table if exists app_public_v2.counter_table;
drop table if exists app_public_v2.background;
drop table if exists app_public_v2.gene;
drop table if exists app_public_v2.pmid_info;
drop table if exists app_public_v2.gse_info;

drop type if exists app_public_v2.gene_mapping;
drop type if exists app_public_v2.paginated_ranked_gene_sets_result;

drop materialized view if exists app_public_v2.ranked_gene_sets;
drop index if exists app_public_v2.gene_set_id_rank_idx;


drop index if exists app_public_v2.gene_set_gene_ids_idx;
drop index if exists app_public_v2.gene_set_term_trgm_idx;
drop index if exists app_public_v2.gene_set_hash_idx;
drop index if exists app_public_v2.gene_set_gse_idx;
drop index if exists app_public_v2.gene_set_pmc_idx;
drop index if exists app_public_v2.idx_gene_set_pvalue_odds;
drop index if exists app_public_v2.gse_info_gse_idx;
drop index if exists app_public_v2.pmid_info_pmid_idx;
drop index if exists app_public_v2.gene_set_pmid_gse_idx;
drop index if exists app_public_v2.gene_set_pmid_gse_id__idx;
drop table if exists app_public_v2.gene_set;

drop schema if exists app_public_v2 cascade;
drop schema if exists app_private_v2 cascade;

drop role if exists guest;
drop role if exists authenticated;

drop extension if exists "uuid-ossp";
drop extension if exists "plpython3u";
drop extension if exists "pg_trgm";
