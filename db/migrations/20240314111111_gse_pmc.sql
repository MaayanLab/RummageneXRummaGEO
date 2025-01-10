-- migrate:up
create table app_public_v2.gse_info (
 id uuid primary key default uuid_generate_v4(),
 gse varchar,
 pmid varchar,
 title varchar,
 summary varchar,
 published_date date,
 species varchar,
 platform varchar,
 sample_groups jsonb,
 gse_attrs varchar[],
 silhouette_score float
);
grant select on app_public_v2.gse_info to guest;
grant all privileges on app_public_v2.gse_info to authenticated;
comment on table app_public_v2.gse_info is E'@foreignKey (gse) references app_public_v2.gene_set (gse)';
create index gse_info_gse_idx on app_public_v2.gse_info (gse);

create table  app_public_v2.pmid_info (
 id uuid primary key default uuid_generate_v4(),
 pmid varchar not null unique,
 pmcid varchar,
 title varchar,
 pub_date varchar,
 doi varchar
);
grant select on app_public_v2.pmid_info to guest;
grant all privileges on app_public_v2.pmid_info to authenticated;
create index pmid_info_pmid_idx on app_public_v2.pmid_info (pmid);


create materialized view app_public_v2.gene_set_pmid as
select
   gse_info.id as gse_id,
   gse_info.gse as gse,
   gse_info.pmid,
   gse_info.title,
   gse_info.sample_groups,
   gse_info.platform,
   gse_info.published_date,
   gs.species
from
   app_public_v2.gene_set gs
join
   app_public_v2.gse_info gse_info
on gs.gse = gse_info.gse; 

comment on materialized view app_public_v2.gene_set_pmid is E'@foreignKey (gse) references app_public_v2.gse_info (gse)'; -- Adjust foreign key reference if needed


create or replace function app_public_v2.get_gse_info_by_ids(gseids varchar[])
returns setof app_public_v2.gse_info as
$$
  select *
  from app_public_v2.gse_info
  where gse = ANY (gseids);
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.get_gse_info_by_ids to guest, authenticated;


create or replace function app_public_v2.gene_set_term_search2(terms varchar[]) returns setof app_public_v2.gene_set_pmid
as $$
  select distinct gs.*
  from app_public_v2.gene_set_pmid gs
  inner join unnest(terms) ut(term) on gs.title ilike ('%' || ut.term || '%');
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.gene_set_term_search2 to guest, authenticated;

create index gene_set_pmid_gse_idx on app_public_v2.gene_set_pmid (gse);
create index gene_set_pmid_gse_id__idx on app_public_v2.gene_set_pmid (gse_id);


grant select on app_public_v2.gene_set_pmid to guest;
grant all privileges on app_public_v2.gene_set_pmid to authenticated;

create view app_public_v2.pmid as select distinct pmid from app_public_v2.gene_set_pmid;
comment on view app_public_v2.pmid is E'@foreignKey (pmid) references app_public_v2.gene_set_pmid (pmid)';

grant select on app_public_v2.pmid to guest;
grant all privileges on app_public_v2.pmid to authenticated;

create function app_public_v2.get_pb_info_by_ids(pmids varchar[])
returns setof app_public_v2.gene_set_pmid as
$$
  select *
  from app_public_v2.gene_set_pmid
  where pmid = ANY(pmids)
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.get_pb_info_by_ids to guest, authenticated;

create function app_public_v2.get_pb_meta_by_ids(pmids varchar[])
returns setof app_public_v2.pmid_info as
$$
  select *
  from app_public_v2.pmid_info
  where pmid = ANY(pmids)
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.get_pb_meta_by_ids to guest, authenticated;

-- migrate:down
drop function app_public_v2.gene_set_term_search2;
drop function app_public_v2.get_gse_info_by_ids;
drop function app_public_v2.get_pb_info_by_ids;
drop function app_public_v2.get_pb_meta_by_ids;

drop index app_public_v2.gse_info_gse_idx;
drop index app_public_v2.pmid_info_pmid_idx;
drop index app_public_v2.gene_set_pmid_gse_idx;
drop index app_public_v2.gene_set_pmid_gse_id__idx;


drop view app_public_v2.pmid;
drop materialized view app_public_v2.gene_set_pmid;



drop table app_public_v2.gse_info;
drop table app_public_v2.pmid_info;



