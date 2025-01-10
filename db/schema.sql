SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app_private_v2; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_private_v2;


--
-- Name: app_public_v2; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app_public_v2;


--
-- Name: plpython3u; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpython3u WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpython3u; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpython3u IS 'PL/Python3U untrusted procedural language';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: enrich_result; Type: TYPE; Schema: app_public_v2; Owner: -
--

CREATE TYPE app_public_v2.enrich_result AS (
	gene_set_hash uuid,
	n_overlap integer,
	odds_ratio double precision,
	pvalue double precision,
	adj_pvalue double precision
);


--
-- Name: TYPE enrich_result; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON TYPE app_public_v2.enrich_result IS '@foreign key (gene_set_hash) references app_public_v2.gene_set (hash)';


--
-- Name: gene_mapping; Type: TYPE; Schema: app_public_v2; Owner: -
--

CREATE TYPE app_public_v2.gene_mapping AS (
	gene_id uuid,
	gene character varying
);


--
-- Name: paginated_enrich_result; Type: TYPE; Schema: app_public_v2; Owner: -
--

CREATE TYPE app_public_v2.paginated_enrich_result AS (
	nodes app_public_v2.enrich_result[],
	total_count integer
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: gene_set; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.gene_set (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    term character varying NOT NULL,
    gene_ids jsonb NOT NULL,
    n_gene_ids integer NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL,
    hash uuid NOT NULL,
    description character varying,
    species character varying NOT NULL,
    gse character varying,
    pmc character varying,
    hypothesis_title character varying,
    hypothesis text,
    pvalue double precision,
    rummagene_size integer,
    rummageo_size integer,
    odds double precision,
    enrich_links character varying,
    hypothesis_rating double precision DEFAULT 0,
    rating_counts integer DEFAULT 0
);


--
-- Name: ranked_gene_sets; Type: MATERIALIZED VIEW; Schema: app_public_v2; Owner: -
--

CREATE MATERIALIZED VIEW app_public_v2.ranked_gene_sets AS
 SELECT gene_set.id,
    gene_set.term,
    gene_set.species,
    gene_set.hypothesis,
    gene_set.hypothesis_title,
    row_number() OVER (ORDER BY gene_set.pvalue, gene_set.odds DESC) AS rank
   FROM app_public_v2.gene_set
  WHERE (gene_set.hypothesis IS NOT NULL)
  ORDER BY gene_set.pvalue, gene_set.odds DESC
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW ranked_gene_sets; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON MATERIALIZED VIEW app_public_v2.ranked_gene_sets IS '@foreignKey (id) references app_public_v2.gene_set (id)';


--
-- Name: paginated_ranked_gene_sets_result; Type: TYPE; Schema: app_public_v2; Owner: -
--

CREATE TYPE app_public_v2.paginated_ranked_gene_sets_result AS (
	ranked_sets app_public_v2.ranked_gene_sets[],
	total_count integer
);


--
-- Name: background; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.background (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    gene_ids jsonb NOT NULL,
    n_gene_ids integer NOT NULL,
    created timestamp without time zone DEFAULT now()
);


--
-- Name: indexed_enrich(app_public_v2.background, uuid[], character varying, integer, double precision, double precision, integer, integer); Type: FUNCTION; Schema: app_private_v2; Owner: -
--

CREATE FUNCTION app_private_v2.indexed_enrich(background app_public_v2.background, gene_ids uuid[], filter_term character varying DEFAULT NULL::character varying, overlap_ge integer DEFAULT 1, pvalue_le double precision DEFAULT 0.05, adj_pvalue_le double precision DEFAULT 0.05, "offset" integer DEFAULT NULL::integer, first integer DEFAULT NULL::integer) RETURNS app_public_v2.paginated_enrich_result
    LANGUAGE plpython3u IMMUTABLE PARALLEL SAFE
    AS $$
  import os, requests
  params = dict(
    overlap_ge=overlap_ge,
    pvalue_le=pvalue_le,
    adj_pvalue_le=adj_pvalue_le,
  )
  if filter_term: params['filter_term'] = filter_term
  if offset: params['offset'] = offset
  if first: params['limit'] = first
  req = requests.post(
    f"{os.environ.get('ENRICH_URL')}/{background['id']}",
    params=params,
    json=gene_ids,
  )
  total_count = req.headers.get('Content-Range').partition('/')[-1]
  return dict(nodes=req.json(), total_count=total_count)
$$;


--
-- Name: user_gene_set; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.user_gene_set (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    genes character varying[],
    description character varying DEFAULT ''::character varying,
    created timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: add_user_gene_set(character varying[], character varying); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.add_user_gene_set(genes character varying[], description character varying DEFAULT ''::character varying) RETURNS app_public_v2.user_gene_set
    LANGUAGE sql SECURITY DEFINER
    AS $$
  insert into app_public_v2.user_gene_set (genes, description)
  select
    (
      select array_agg(ug.gene order by ug.gene)
      from unnest(add_user_gene_set.genes) ug(gene)
    ) as genes,
    add_user_gene_set.description
  returning *;
$$;


--
-- Name: background_enrich(app_public_v2.background, character varying[], character varying, integer, double precision, double precision, integer, integer); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.background_enrich(background app_public_v2.background, genes character varying[], filter_term character varying DEFAULT NULL::character varying, overlap_ge integer DEFAULT 1, pvalue_le double precision DEFAULT 0.05, adj_pvalue_le double precision DEFAULT 0.05, "offset" integer DEFAULT NULL::integer, first integer DEFAULT NULL::integer) RETURNS app_public_v2.paginated_enrich_result
    LANGUAGE sql IMMUTABLE SECURITY DEFINER PARALLEL SAFE
    AS $$
  select r.*
  from app_private_v2.indexed_enrich(
    background_enrich.background,
    (select array_agg(gene_id) from app_public_v2.gene_map(genes) gm),
    background_enrich.filter_term,
    background_enrich.overlap_ge,
    background_enrich.pvalue_le,
    background_enrich.adj_pvalue_le,
    background_enrich."offset",
    background_enrich."first"
  ) r;
$$;


--
-- Name: background_overlap(app_public_v2.background, character varying[], integer); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.background_overlap(background app_public_v2.background, genes character varying[], overlap_greater_than integer DEFAULT 0) RETURNS TABLE(gene_set_id uuid, n_overlap_gene_ids integer, n_gs_gene_ids integer)
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  select gs.id as gene_set_id, count(ig.gene_id) as n_overlap_gene_ids, gs.n_gene_ids as n_gs_gene_ids
  from (select distinct g.gene_id::text from app_public_v2.gene_map(genes) g) ig
  inner join app_public_v2.gene_set gs on gs.gene_ids ? ig.gene_id
  group by gs.id having count(ig.gene_id) > overlap_greater_than;
$$;


--
-- Name: current_background(); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.current_background() RETURNS app_public_v2.background
    LANGUAGE sql IMMUTABLE STRICT SECURITY DEFINER PARALLEL SAFE
    AS $$
  select *
  from app_public_v2.background
  order by created asc
  limit 1;
$$;


--
-- Name: enrich_result_gene_sets(app_public_v2.enrich_result); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.enrich_result_gene_sets(enrich_result app_public_v2.enrich_result) RETURNS SETOF app_public_v2.gene_set
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  select gs.*
  from app_public_v2.gene_set gs
  where gs.hash = enrich_result.gene_set_hash;
$$;


--
-- Name: gene_map(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.gene_map(genes character varying[]) RETURNS SETOF app_public_v2.gene_mapping
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select g.id as gene_id, ug.gene as gene
  from unnest(genes) ug(gene)
  inner join app_public_v2.gene g on g.symbol = ug.gene or g.synonyms ? ug.gene;
$$;


--
-- Name: gene_map_2(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.gene_map_2(genes character varying[]) RETURNS SETOF app_public_v2.gene_mapping
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select g.id as gene_id, ug.gene as gene
  from unnest(gene_map_2.genes) ug(gene)
  inner join app_public_v2.gene g on g.symbol = upper(ug.gene) or g.synonyms ? upper(ug.gene);
$$;


--
-- Name: gene; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.gene (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    symbol character varying NOT NULL,
    synonyms jsonb DEFAULT '{}'::jsonb,
    ncbi_gene_id integer,
    description character varying,
    summary text
);


--
-- Name: gene_mapping_gene_info(app_public_v2.gene_mapping); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.gene_mapping_gene_info(gene_mapping app_public_v2.gene_mapping) RETURNS app_public_v2.gene
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select *
  from app_public_v2.gene g
  where g.id = gene_mapping.gene_id
$$;


--
-- Name: gene_set_gene_search(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.gene_set_gene_search(genes character varying[]) RETURNS SETOF app_public_v2.gene_set
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select distinct gs.*
  from
    app_public_v2.gene_map(genes) g
    inner join app_public_v2.gene_set gs on gs.gene_ids ? g.gene_id::text;
$$;


--
-- Name: gene_set_genes(app_public_v2.gene_set); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.gene_set_genes(gene_set app_public_v2.gene_set) RETURNS SETOF app_public_v2.gene
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select g.*
  from jsonb_each(gene_set_genes.gene_set.gene_ids) gsg(gene_id, position)
  inner join app_public_v2.gene g on gsg.gene_id = g.id::text
  order by gsg.position asc;
$$;


--
-- Name: gene_set_overlap(app_public_v2.gene_set, character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.gene_set_overlap(gene_set app_public_v2.gene_set, genes character varying[]) RETURNS SETOF app_public_v2.gene
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  select distinct g.*
  from app_public_v2.gene_map(gene_set_overlap.genes) gm
  inner join app_public_v2.gene g on g.id = gm.gene_id
  where gene_set.gene_ids ? gm.gene_id::text;
$$;


--
-- Name: gene_set_term_search(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.gene_set_term_search(terms character varying[]) RETURNS SETOF app_public_v2.gene_set
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select distinct gs.*
  from app_public_v2.gene_set gs
  inner join unnest(terms) ut(term) on gs.term ilike ('%' || ut.term || '%');
$$;


--
-- Name: gse_info; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.gse_info (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    gse character varying,
    pmid character varying,
    title character varying,
    summary character varying,
    published_date date,
    species character varying,
    platform character varying,
    sample_groups jsonb,
    gse_attrs character varying[],
    silhouette_score double precision
);


--
-- Name: TABLE gse_info; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON TABLE app_public_v2.gse_info IS '@foreignKey (gse) references app_public_v2.gene_set (gse)';


--
-- Name: gene_set_pmid; Type: MATERIALIZED VIEW; Schema: app_public_v2; Owner: -
--

CREATE MATERIALIZED VIEW app_public_v2.gene_set_pmid AS
 SELECT gse_info.id AS gse_id,
    gse_info.gse,
    gse_info.pmid,
    gse_info.title,
    gse_info.sample_groups,
    gse_info.platform,
    gse_info.published_date,
    gs.species
   FROM (app_public_v2.gene_set gs
     JOIN app_public_v2.gse_info gse_info ON (((gs.gse)::text = (gse_info.gse)::text)))
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW gene_set_pmid; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON MATERIALIZED VIEW app_public_v2.gene_set_pmid IS '@foreignKey (gse) references app_public_v2.gse_info (gse)';


--
-- Name: gene_set_term_search2(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.gene_set_term_search2(terms character varying[]) RETURNS SETOF app_public_v2.gene_set_pmid
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select distinct gs.*
  from app_public_v2.gene_set_pmid gs
  inner join unnest(terms) ut(term) on gs.title ilike ('%' || ut.term || '%');
$$;


--
-- Name: get_gse_info_by_ids(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.get_gse_info_by_ids(gseids character varying[]) RETURNS SETOF app_public_v2.gse_info
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select *
  from app_public_v2.gse_info
  where gse = ANY (gseids);
$$;


--
-- Name: gsm_meta; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.gsm_meta (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    gsm character varying NOT NULL,
    gse character varying,
    title character varying,
    characteristics_ch1 character varying,
    source_name_ch1 character varying
);


--
-- Name: get_gsm_meta(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.get_gsm_meta(gsms character varying[]) RETURNS SETOF app_public_v2.gsm_meta
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select *
  from app_public_v2.gsm_meta
  where gsm = ANY (gsms);
$$;


--
-- Name: get_paginated_ranked_gene_sets(integer, integer, character varying, boolean, character varying); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.get_paginated_ranked_gene_sets(p_limit integer, p_offset integer, p_term character varying DEFAULT NULL::character varying, p_case_sensitive boolean DEFAULT false, p_species character varying DEFAULT NULL::character varying) RETURNS app_public_v2.paginated_ranked_gene_sets_result
    LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
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
$$;


--
-- Name: get_pb_info_by_ids(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.get_pb_info_by_ids(pmids character varying[]) RETURNS SETOF app_public_v2.gene_set_pmid
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select *
  from app_public_v2.gene_set_pmid
  where pmid = ANY(pmids)
$$;


--
-- Name: pmid_info; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.pmid_info (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    pmid character varying NOT NULL,
    pmcid character varying,
    title character varying,
    pub_date character varying,
    doi character varying
);


--
-- Name: get_pb_meta_by_ids(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.get_pb_meta_by_ids(pmids character varying[]) RETURNS SETOF app_public_v2.pmid_info
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select *
  from app_public_v2.pmid_info
  where pmid = ANY(pmids)
$$;


--
-- Name: pmc_info; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.pmc_info (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    pmc character varying NOT NULL,
    title character varying,
    abstract character varying,
    yr integer,
    doi character varying
);


--
-- Name: TABLE pmc_info; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON TABLE app_public_v2.pmc_info IS '@foreignKey (pmc) references app_public_v2.gene_set (pmc)';


--
-- Name: get_pmc_info_by_ids(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.get_pmc_info_by_ids(pmcids character varying[]) RETURNS SETOF app_public_v2.pmc_info
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select *
  from app_public_v2.pmc_info
  where pmc = ANY (pmcids);
$$;


--
-- Name: increment_counter(); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.increment_counter() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
    updated_count integer;
begin
    update app_public_v2.counter_table
    set count = count + 1
    where id = 1
    returning count into updated_count;

    return updated_count;
end;
$$;


--
-- Name: release; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.release (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    n_publications_processed bigint,
    created timestamp without time zone DEFAULT now()
);


--
-- Name: pmc_stats; Type: MATERIALIZED VIEW; Schema: app_private_v2; Owner: -
--

CREATE MATERIALIZED VIEW app_private_v2.pmc_stats AS
 SELECT sum(release.n_publications_processed) AS n_publications_processed
   FROM app_public_v2.release
  WITH NO DATA;


--
-- Name: pmc_stats(); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.pmc_stats() RETURNS app_private_v2.pmc_stats
    LANGUAGE sql IMMUTABLE STRICT SECURITY DEFINER PARALLEL SAFE
    AS $$
  select * from app_private_v2.pmc_stats;
$$;


--
-- Name: terms_gses_array(character varying); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.terms_gses_array(term character varying) RETURNS character varying[]
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select array(
    select gsp.gse
    from
      app_public_v2.gse_info as gsp
    where
       gsp.title ilike '%' || term || '%'
      or gsp.summary ilike '%' || term || '%'
    limit 5000
  );
$$;


--
-- Name: terms_gses_count(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.terms_gses_count(gseids character varying[]) RETURNS TABLE(gse character varying, term character varying, id uuid, count integer)
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select gsp.gse, gs.term, gs.id, gs.n_gene_ids as count
  from
    app_public_v2.gene_set_gse as gsp
    inner join app_public_v2.gene_set as gs on gs.gse = gsp.gse
  where gsp.gse = ANY (gseids);
$$;


--
-- Name: terms_pmcs_array(character varying); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.terms_pmcs_array(term character varying) RETURNS character varying[]
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
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
$$;


--
-- Name: terms_pmcs_count(character varying[]); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.terms_pmcs_count(pmcids character varying[]) RETURNS TABLE(pmc character varying, term character varying, id uuid, count integer)
    LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
    AS $$
  select gsp.pmc, gs.term, gs.id, gs.n_gene_ids as count
  from
    app_public_v2.gene_set_pmc as gsp
    inner join app_public_v2.gene_set as gs on gs.pmc = gsp.pmc
  where gsp.pmc = ANY (pmcids);
$$;


--
-- Name: update_hypothesis(uuid, character varying); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.update_hypothesis(p_id uuid, p_hypothesis character varying) RETURNS app_public_v2.gene_set
    LANGUAGE plpgsql
    AS $$
begin
    update app_public_v2.gene_set
    set hypothesis = p_hypothesis
    where id = p_id;

    if not found then
        raise exception 'Gene set with ID % not found', p_id;
    end if;
end;
$$;


--
-- Name: update_ratings(uuid, double precision); Type: FUNCTION; Schema: app_public_v2; Owner: -
--

CREATE FUNCTION app_public_v2.update_ratings(p_id uuid, p_rating double precision) RETURNS app_public_v2.gene_set
    LANGUAGE plpgsql
    AS $$
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
$$;


--
-- Name: counter_table; Type: TABLE; Schema: app_public_v2; Owner: -
--

CREATE TABLE app_public_v2.counter_table (
    id integer NOT NULL,
    count integer DEFAULT 0
);


--
-- Name: counter_table_id_seq; Type: SEQUENCE; Schema: app_public_v2; Owner: -
--

CREATE SEQUENCE app_public_v2.counter_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: counter_table_id_seq; Type: SEQUENCE OWNED BY; Schema: app_public_v2; Owner: -
--

ALTER SEQUENCE app_public_v2.counter_table_id_seq OWNED BY app_public_v2.counter_table.id;


--
-- Name: gene_set_gse; Type: MATERIALIZED VIEW; Schema: app_public_v2; Owner: -
--

CREATE MATERIALIZED VIEW app_public_v2.gene_set_gse AS
 SELECT gs.gse,
    gs.species
   FROM app_public_v2.gene_set gs
  GROUP BY gs.gse, gs.species
  WITH NO DATA;


--
-- Name: MATERIALIZED VIEW gene_set_gse; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON MATERIALIZED VIEW app_public_v2.gene_set_gse IS 'Aggregates ids by gse and species';


--
-- Name: gene_set_pmc; Type: MATERIALIZED VIEW; Schema: app_public_v2; Owner: -
--

CREATE MATERIALIZED VIEW app_public_v2.gene_set_pmc AS
 SELECT DISTINCT gene_set.pmc
   FROM app_public_v2.gene_set
  WITH NO DATA;


--
-- Name: gse; Type: VIEW; Schema: app_public_v2; Owner: -
--

CREATE VIEW app_public_v2.gse AS
 SELECT DISTINCT gene_set_gse.gse
   FROM app_public_v2.gene_set_gse;


--
-- Name: VIEW gse; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON VIEW app_public_v2.gse IS '@foreignKey (gse) references app_public_v2.gene_set_gse (gse)';


--
-- Name: gse_stats; Type: MATERIALIZED VIEW; Schema: app_public_v2; Owner: -
--

CREATE MATERIALIZED VIEW app_public_v2.gse_stats AS
 SELECT gene_set.species,
    count(DISTINCT ((gene_set.gse)::text || (gene_set.species)::text)) AS n_occurrences_processed
   FROM app_public_v2.gene_set
  WHERE ((gene_set.species)::text = ANY ((ARRAY['human'::character varying, 'mouse'::character varying])::text[]))
  GROUP BY gene_set.species
  WITH NO DATA;


--
-- Name: pmc; Type: VIEW; Schema: app_public_v2; Owner: -
--

CREATE VIEW app_public_v2.pmc AS
 SELECT DISTINCT gene_set_pmc.pmc
   FROM app_public_v2.gene_set_pmc;


--
-- Name: VIEW pmc; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON VIEW app_public_v2.pmc IS '@foreignKey (pmc) references app_public_v2.gene_set_pmc (pmc)';


--
-- Name: pmc_term_stats; Type: MATERIALIZED VIEW; Schema: app_public_v2; Owner: -
--

CREATE MATERIALIZED VIEW app_public_v2.pmc_term_stats AS
 SELECT count(DISTINCT "substring"((gene_set.term)::text, '^(.+?);'::text)) AS unique_term_parts_count
   FROM app_public_v2.gene_set
  WITH NO DATA;


--
-- Name: pmid; Type: VIEW; Schema: app_public_v2; Owner: -
--

CREATE VIEW app_public_v2.pmid AS
 SELECT DISTINCT gene_set_pmid.pmid
   FROM app_public_v2.gene_set_pmid;


--
-- Name: VIEW pmid; Type: COMMENT; Schema: app_public_v2; Owner: -
--

COMMENT ON VIEW app_public_v2.pmid IS '@foreignKey (pmid) references app_public_v2.gene_set_pmid (pmid)';


--
-- Name: unique_term_counts; Type: MATERIALIZED VIEW; Schema: app_public_v2; Owner: -
--

CREATE MATERIALIZED VIEW app_public_v2.unique_term_counts AS
 SELECT count(DISTINCT gene_set.term) AS unique_term_count
   FROM app_public_v2.gene_set
  WITH NO DATA;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: counter_table id; Type: DEFAULT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.counter_table ALTER COLUMN id SET DEFAULT nextval('app_public_v2.counter_table_id_seq'::regclass);


--
-- Name: background background_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.background
    ADD CONSTRAINT background_pkey PRIMARY KEY (id);


--
-- Name: counter_table counter_table_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.counter_table
    ADD CONSTRAINT counter_table_pkey PRIMARY KEY (id);


--
-- Name: gene gene_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.gene
    ADD CONSTRAINT gene_pkey PRIMARY KEY (id);


--
-- Name: gene_set gene_set_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.gene_set
    ADD CONSTRAINT gene_set_pkey PRIMARY KEY (id);


--
-- Name: gene_set gene_set_term_key; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.gene_set
    ADD CONSTRAINT gene_set_term_key UNIQUE (term);


--
-- Name: gene gene_symbol_key; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.gene
    ADD CONSTRAINT gene_symbol_key UNIQUE (symbol);


--
-- Name: gse_info gse_info_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.gse_info
    ADD CONSTRAINT gse_info_pkey PRIMARY KEY (id);


--
-- Name: gsm_meta gsm_meta_gsm_key; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.gsm_meta
    ADD CONSTRAINT gsm_meta_gsm_key UNIQUE (gsm);


--
-- Name: gsm_meta gsm_meta_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.gsm_meta
    ADD CONSTRAINT gsm_meta_pkey PRIMARY KEY (id);


--
-- Name: pmc_info pmc_info_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.pmc_info
    ADD CONSTRAINT pmc_info_pkey PRIMARY KEY (id);


--
-- Name: pmc_info pmc_info_pmc_key; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.pmc_info
    ADD CONSTRAINT pmc_info_pmc_key UNIQUE (pmc);


--
-- Name: pmid_info pmid_info_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.pmid_info
    ADD CONSTRAINT pmid_info_pkey PRIMARY KEY (id);


--
-- Name: pmid_info pmid_info_pmid_key; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.pmid_info
    ADD CONSTRAINT pmid_info_pmid_key UNIQUE (pmid);


--
-- Name: release release_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.release
    ADD CONSTRAINT release_pkey PRIMARY KEY (id);


--
-- Name: user_gene_set user_gene_set_pkey; Type: CONSTRAINT; Schema: app_public_v2; Owner: -
--

ALTER TABLE ONLY app_public_v2.user_gene_set
    ADD CONSTRAINT user_gene_set_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: background_gene_ids_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX background_gene_ids_idx ON app_public_v2.background USING gin (gene_ids);


--
-- Name: gene_set_gene_ids_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_gene_ids_idx ON app_public_v2.gene_set USING gin (gene_ids);


--
-- Name: gene_set_gse_gse_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_gse_gse_idx ON app_public_v2.gene_set_gse USING btree (gse);


--
-- Name: gene_set_gse_id_gse_species_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE UNIQUE INDEX gene_set_gse_id_gse_species_idx ON app_public_v2.gene_set_gse USING btree (gse, species);


--
-- Name: gene_set_gse_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_gse_idx ON app_public_v2.gene_set USING btree (gse);


--
-- Name: gene_set_gse_species_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_gse_species_idx ON app_public_v2.gene_set_gse USING btree (species);


--
-- Name: gene_set_hash_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_hash_idx ON app_public_v2.gene_set USING btree (hash);


--
-- Name: gene_set_id_rank_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE UNIQUE INDEX gene_set_id_rank_idx ON app_public_v2.ranked_gene_sets USING btree (rank);


--
-- Name: gene_set_pmc_id_pmc_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE UNIQUE INDEX gene_set_pmc_id_pmc_idx ON app_public_v2.gene_set_pmc USING btree (pmc);


--
-- Name: gene_set_pmc_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_pmc_idx ON app_public_v2.gene_set USING btree (pmc);


--
-- Name: gene_set_pmc_pmc_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE UNIQUE INDEX gene_set_pmc_pmc_idx ON app_public_v2.gene_set_pmc USING btree (pmc);


--
-- Name: gene_set_pmc_pmc_search_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_pmc_pmc_search_idx ON app_public_v2.gene_set_pmc USING btree (pmc);


--
-- Name: gene_set_pmid_gse_id__idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_pmid_gse_id__idx ON app_public_v2.gene_set_pmid USING btree (gse_id);


--
-- Name: gene_set_pmid_gse_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_pmid_gse_idx ON app_public_v2.gene_set_pmid USING btree (gse);


--
-- Name: gene_set_term_trgm_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_set_term_trgm_idx ON app_public_v2.gene_set USING gin (term public.gin_trgm_ops);


--
-- Name: gene_synonyms_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gene_synonyms_idx ON app_public_v2.gene USING gin (synonyms);


--
-- Name: gse_info_gse_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX gse_info_gse_idx ON app_public_v2.gse_info USING btree (gse);


--
-- Name: idx_gene_set_pvalue_odds; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX idx_gene_set_pvalue_odds ON app_public_v2.gene_set USING btree (pvalue, odds DESC);


--
-- Name: idx_gsm_meta_gsm; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX idx_gsm_meta_gsm ON app_public_v2.gsm_meta USING btree (gsm);


--
-- Name: pmid_info_pmid_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX pmid_info_pmid_idx ON app_public_v2.pmid_info USING btree (pmid);


--
-- Name: release_created_idx; Type: INDEX; Schema: app_public_v2; Owner: -
--

CREATE INDEX release_created_idx ON app_public_v2.release USING btree (created);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20230805154745'),
    ('20230905154745'),
    ('20230920195024'),
    ('20230920201419'),
    ('20230925181844'),
    ('20240312145213'),
    ('20240314111111'),
    ('20240315111111'),
    ('20240316111111'),
    ('20240316211111');
