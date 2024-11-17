-- migrate:up

create materialized view app_public_v2.gene_set_gse as
select 
    gs.gse as gse, 
    gs.species
from 
    app_public_v2.gene_set gs
group by 
    gse, gs.species;

comment on materialized view app_public_v2.gene_set_gse is E'Aggregates ids by gse and species';


CREATE UNIQUE INDEX gene_set_gse_id_gse_species_idx ON app_public_v2.gene_set_gse (gse, species);
create index gene_set_gse_species_idx on app_public_v2.gene_set_gse (species);
create index gene_set_gse_gse_idx on app_public_v2.gene_set_gse (gse);

grant select on app_public_v2.gene_set_gse to guest;
grant all privileges on app_public_v2.gene_set_gse to authenticated;



create or replace function app_public_v2.terms_gses_count(gseids varchar[])
returns table (gse varchar, term varchar, id uuid, count int) as
$$
  select gsp.gse, gs.term, gs.id, gs.n_gene_ids as count
  from 
    app_public_v2.gene_set_gse as gsp
    inner join app_public_v2.gene_set as gs on gs.gse = gsp.gse
  where gsp.gse = ANY (gseids);
$$ language sql immutable strict parallel safe;
grant execute on function app_public_v2.terms_gses_count to guest, authenticated;

create view app_public_v2.gse as select distinct gse from app_public_v2.gene_set_gse;
comment on view app_public_v2.gse is E'@foreignKey (gse) references app_public_v2.gene_set_gse (gse)';

grant select on app_public_v2.gse to guest;
grant all privileges on app_public_v2.gse to authenticated;


create or replace function app_public_v2.terms_gses_array(term varchar)
returns varchar[] as
$$
  select array(
    select gsp.gse
    from 
      app_public_v2.gse_info as gsp
    where 
       gsp.title ilike '%' || term || '%' 
      or gsp.summary ilike '%' || term || '%'
    limit 5000
  );
$$ language sql immutable strict parallel safe;

grant execute on function app_public_v2.terms_gses_array to guest, authenticated;



-- migrate:down

drop materialized view app_public_v2.gene_set_gse cascade;
