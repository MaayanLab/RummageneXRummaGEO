--migrate:up
create type app_public_v2.enrich_result as (
  gene_set_hash uuid,
  n_overlap int,
  odds_ratio double precision,
  pvalue double precision,
  adj_pvalue double precision
);
comment on type app_public_v2.enrich_result is E'@foreign key (gene_set_hash) references app_public_v2.gene_set (hash)';

create or replace function app_public_v2.enrich_result_gene_sets(enrich_result app_public_v2.enrich_result) returns setof app_public_v2.gene_set
as $$
  select gs.*
  from app_public_v2.gene_set gs
  where gs.hash = enrich_result.gene_set_hash;
$$ language sql immutable strict;
grant execute on function app_public_v2.enrich_result_gene_sets to guest, authenticated;

create or replace function app_public_v2.gene_set_genes(gene_set app_public_v2.gene_set)
returns setof app_public_v2.gene as
$$
  select g.*
  from jsonb_each(gene_set_genes.gene_set.gene_ids) gsg(gene_id, position)
  inner join app_public_v2.gene g on gsg.gene_id = g.id::text
  order by gsg.position asc;
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.gene_set_genes to guest, authenticated;

create or replace function app_public_v2.gene_set_overlap(
  gene_set app_public_v2.gene_set,
  genes varchar[]
) returns setof app_public_v2.gene
as $$
  select distinct g.*
  from app_public_v2.gene_map(gene_set_overlap.genes) gm
  inner join app_public_v2.gene g on g.id = gm.gene_id
  where gene_set.gene_ids ? gm.gene_id::text;
$$ language sql immutable strict;
grant execute on function app_public_v2.gene_set_overlap to guest, authenticated;

create table app_public_v2.user_gene_set (
  id uuid primary key default uuid_generate_v4(),
  genes varchar[],
  description varchar default '',
  created timestamp not null default now()
);
grant select on table app_public_v2.user_gene_set to guest;
grant all privileges on table app_public_v2.user_gene_set to authenticated;

create or replace function app_public_v2.add_user_gene_set(
  genes varchar[],
  description varchar default ''
) returns app_public_v2.user_gene_set
as $$
  insert into app_public_v2.user_gene_set (genes, description)
  select
    (
      select array_agg(ug.gene order by ug.gene)
      from unnest(add_user_gene_set.genes) ug(gene)
    ) as genes,
    add_user_gene_set.description
  returning *;
$$ language sql security definer;
grant execute on function app_public_v2.add_user_gene_set to guest, authenticated;

create or replace function app_public_v2.gene_set_term_search(terms varchar[]) returns setof app_public_v2.gene_set
as $$
  select distinct gs.*
  from app_public_v2.gene_set gs
  inner join unnest(terms) ut(term) on gs.term ilike ('%' || ut.term || '%');
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.gene_set_term_search to guest, authenticated;

create or replace function app_public_v2.gene_set_gene_search(genes varchar[]) returns setof app_public_v2.gene_set
as $$
  select distinct gs.*
  from
    app_public_v2.gene_map(genes) g
    inner join app_public_v2.gene_set gs on gs.gene_ids ? g.gene_id::text;
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.gene_set_gene_search to guest, authenticated;

create materialized view app_public_v2.gene_set_pmc as
select distinct pmc
from app_public_v2.gene_set;
create unique index gene_set_pmc_id_pmc_idx on app_public_v2.gene_set_pmc (pmc);
create unique index gene_set_pmc_pmc_idx on app_public_v2.gene_set_pmc (pmc);
create index gene_set_pmc_pmc_search_idx on app_public_v2.gene_set_pmc using btree (pmc);
grant select on app_public_v2.gene_set_pmc to guest;
grant all privileges on app_public_v2.gene_set_pmc to authenticated;

create view app_public_v2.pmc as select distinct pmc from app_public_v2.gene_set_pmc;
comment on view app_public_v2.pmc is E'@foreignKey (pmc) references app_public_v2.gene_set_pmc (pmc)';

grant select on app_public_v2.pmc to guest;
grant all privileges on app_public_v2.pmc to authenticated;

create table app_public_v2.pmc_info (
  id uuid primary key default uuid_generate_v4(),
  pmc varchar not null unique,
  title varchar,
  abstract varchar,
  yr int,
  doi varchar
);
comment on table app_public_v2.pmc_info is E'@foreignKey (pmc) references app_public_v2.gene_set (pmc)';

grant select on table app_public_v2.pmc_info to guest;
grant all privileges on table app_public_v2.pmc_info to authenticated;


create or replace function app_public_v2.terms_pmcs_count(pmcids varchar[])
returns table (pmc varchar, term varchar, id uuid, count int) as
$$
  select gsp.pmc, gs.term, gs.id, gs.n_gene_ids as count
  from 
    app_public_v2.gene_set_pmc as gsp
    inner join app_public_v2.gene_set as gs on gs.pmc = gsp.pmc
  where gsp.pmc = ANY (pmcids);
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.terms_pmcs_count to guest, authenticated;

CREATE OR REPLACE FUNCTION app_public_v2.terms_pmcs_array(term VARCHAR)
RETURNS VARCHAR[] AS
$$
  SELECT ARRAY(
    SELECT gsp.pmc
    FROM 
      app_public_v2.pmc_info AS gsp
    WHERE 
       gsp.title ILIKE '%' || term || '%' 
      OR gsp.abstract ILIKE '%' || term || '%'
    LIMIT 5000
  );
$$ LANGUAGE SQL IMMUTABLE STRICT PARALLEL SAFE;

GRANT EXECUTE ON FUNCTION app_public_v2.terms_pmcs_array TO guest, authenticated;

CREATE OR REPLACE FUNCTION app_public_v2.terms_pmcs_array(term VARCHAR)
RETURNS VARCHAR[] AS
$$
  SELECT ARRAY(
    SELECT DISTINCT gsp.pmc
    FROM 
      app_public_v2.pmc_info AS gsp
      INNER JOIN app_public_v2.gene_set AS gs ON gs.pmc = gsp.pmc
    WHERE 
      gs.term ILIKE '%' || term || '%' 
      OR gsp.title ILIKE '%' || term || '%' 
      OR gsp.abstract ILIKE '%' || term || '%'
    LIMIT 5000
  );
$$ LANGUAGE SQL IMMUTABLE STRICT PARALLEL SAFE;

GRANT EXECUTE ON FUNCTION app_public_v2.terms_pmcs_array TO guest, authenticated;


create or replace function app_public_v2.get_pmc_info_by_ids(pmcids varchar[])
returns setof app_public_v2.pmc_info as
$$
  select *
  from app_public_v2.pmc_info
  where pmc = ANY (pmcids);
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.get_pmc_info_by_ids to guest, authenticated;


-- migrate:down
drop function if exists app_public_v2.get_pmc_info_by_ids(varchar[]) cascade;
drop function if exists app_public_v2.terms_pmcs_count(varchar[]) cascade;
drop function if exists app_public_v2.gene_set_gene_search(varchar[]) cascade;
drop function if exists app_public_v2.gene_set_term_search(varchar[]) cascade;
drop function if exists app_public_v2.add_user_gene_set(varchar[], varchar) cascade;
drop function if exists app_public_v2.gene_set_overlap(app_public_v2.gene_set, varchar[]) cascade;
drop function if exists app_public_v2.gene_set_genes(app_public_v2.gene_set) cascade;
drop function if exists app_public_v2.enrich_result_gene_sets(app_public_v2.enrich_result) cascade;
drop function if exists app_public_v2.terms_pmcs_count2 cascade;

drop view if exists app_public_v2.pmc cascade;
drop materialized view if exists app_public_v2.gene_set_pmc cascade;

drop table if exists app_public_v2.pmc_info cascade;

drop table if exists app_public_v2.user_gene_set cascade;

drop type if exists app_public_v2.enrich_result cascade;

drop index if exists gene_set_pmc_id_pmc_idx;
drop index if exists gene_set_pmc_pmc_idx;
drop index if exists gene_set_pmc_pmc_search_idx;




