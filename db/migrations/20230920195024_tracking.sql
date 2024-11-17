-- migrate:up
create table app_public_v2.release (
  id uuid primary key default uuid_generate_v4(),
  n_publications_processed bigint,
  created timestamp default now()
);
create index release_created_idx on app_public_v2.release (created);

grant select on table app_public_v2.release to guest;
grant all privileges on table app_public_v2.release to authenticated;

insert into app_public_v2.release (n_publications_processed)
values (6094975);
grant select on table app_public_v2.release to guest;
grant all privileges on table app_public_v2.release to authenticated;

create materialized view app_private_v2.pmc_stats as
select sum(n_publications_processed) as n_publications_processed
from app_public_v2.release;

create or replace function app_public_v2.pmc_stats() returns app_private_v2.pmc_stats
as $$
  select * from app_private_v2.pmc_stats;
$$ language sql strict immutable parallel safe security definer;
grant execute on function app_public_v2.pmc_stats to guest, authenticated;

-- migrate:down
drop function if exists app_public_v2.pmc_stats() cascade;

drop materialized view if exists app_private_v2.pmc_stats cascade;

drop table if exists app_public_v2.release cascade;

drop index if exists release_created_idx;
