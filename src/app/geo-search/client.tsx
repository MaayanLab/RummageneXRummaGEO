'use client'
import React from 'react'
import useSWR from 'swr'
import { useTermsGsesQuery, useTermsGses4Query } from '@/graphql'
import GseSearchData from '@/components/geoSearchData'
import Image from 'next/image'
import Loading from '@/components/loading2'
import useQsState from '@/utils/useQsState'
import HomeLayout from '@/app/homeLayout'



interface esearchResult {
  count: string
  idlist: string[]
}


interface EutilsSearchResult {
    header: Object
    esearchresult: esearchResult
}

interface EutilsSummaryResult {
    result: {
        uids: string[];  
        [key: string]: { 
            accession?: string;
        } | string[]; 
    };
}

async function geo_search(search: string) {
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gds&term=${search}&sort=relevance&retmax=1000&retmode=json`;
  const searchRes = await fetch(searchUrl);
  const searchData: EutilsSearchResult = await searchRes.json();

  const uids = searchData.esearchresult.idlist;
  function chunkArray(array: string[], chunkSize: number): string[][] {
      const results = [];
      for (let i = 0; i < array.length; i += chunkSize) {
          results.push(array.slice(i, i + chunkSize));
      }
      return results;
  }
  const uidBatches = chunkArray(uids, 400);
  let summaryData: any[] = []; // 
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Step 2: Retrieve metadata for each batch of UIDs
  for (const batch of uidBatches) {
      await delay(1000);  
      const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gds&id=${batch.join(",")}&retmode=json`;
      const summaryRes = await fetch(summaryUrl);
      const batchData: EutilsSummaryResult = await summaryRes.json();

      summaryData.push(...batchData.result.uids.map(uid => batchData.result[uid]));
  }
  return summaryData;
}


function GEOSearchResults({ search }: { search: string }) {
  const { data: gseData, error: err, isLoading } = useSWR(() => search, geo_search);

  const gseCount = React.useMemo(() => gseData?.length, [gseData]) || 0;

  const { data: y, error, loading } = useTermsGses4Query({
    variables: { term: search }
  });
  const gseids = y?.termsGsesArray ?? [];

  const { data, loading: termsLoading } = useTermsGsesQuery({
    skip: gseids.length === 0,
    variables: {gseids }
  });





  const gsesInDb = React.useMemo(() => data?.termsGsesCount?.nodes ? Array.from(new Set(data?.termsGsesCount?.nodes?.map((el) => el?.gse))) : undefined, [data])

  const { gse_terms, gene_set_ids } = React.useMemo(() => {
    const gse_terms = new Map<string, string[]>()
    const gene_set_ids = new Map<string, string[]>()
    data?.termsGsesCount?.nodes?.forEach(el => {
      if (!el || !el.term) return
      if (el.gse) {
        if (!gse_terms.has(el.gse)) {
          gse_terms.set(el.gse, [el.term])
        } else {
          gse_terms.get(el.gse)?.push(el.term)
        }
      }
      if (el.id) {
        gene_set_ids.set(el.term, [el.id, el.count])
      }
    })
    return { gse_terms, gene_set_ids }
  }, [data])


  if (loading || termsLoading || isLoading || err || error) return <Loading />;
  if (!gsesInDb) return <div>Please try again or refresh!</div>;
  if (gsesInDb.length < 1) return <div className="text-center p-5">Your query returned  {Intl.NumberFormat("en-US", {}).format(gseCount)} articles, but none of them are contained in the  RummagenexRummaGEO database. Please try refining your query.</div>
  return (
    <div className="flex flex-col gap-2 my-2">
      <h2 className="text-md font-bold">
        Your query returned the top {Intl.NumberFormat("en-US", {}).format(gseCount)} studies from GEO by relevance. {gseCount > 5000
          ? <>Since there are more than 5,000 studies that match your query, we only display {Intl.NumberFormat("en-US", {}).format(gene_set_ids.size)} gene sets from {Intl.NumberFormat("en-US", {}).format(gse_terms.size)} GEO containing gene sets from the first 5,000 studies returned from your query. Please narrow your search to obtain better results.</>
          : <>RummagenexRummaGEO <Image className="inline-block rounded" src="/images/rummagenexrummageo_logo.png" width={50} height={100} alt="RummagenexRummaGEO"></Image> found {Intl.NumberFormat("en-US", {}).format(gene_set_ids.size)} gene sets from {Intl.NumberFormat("en-US", {}).format(gse_terms.size)} {gse_terms.size === 1 ? "study" : "studies"}  containing gene sets from the studies returned from your query.</>}
      </h2>
      <GseSearchData gse_terms={gse_terms} gses={gsesInDb} gene_set_ids={gene_set_ids}></GseSearchData>
    </div>
  )
}

const examples = [
  'type 2 diabetes',
  'STAT3 knockout',
  'erythrocyte',
]

export default function GEOSearchClientPage(props: { searchParams?: { q?: string, page?: string } }) {
  const [rawSearch, setRawSearch] = React.useState('')
  const [queryString, setQueryString] = useQsState({ page: props.searchParams?.page ?? '1', q: props.searchParams?.q ?? '' })
  React.useEffect(() => setRawSearch(queryString.q ?? ''), [queryString.q])
  if (!queryString.q) {
    return (
      <HomeLayout>
        <h1 className="text-xl">Query GEO and receive gene sets extracted from the returned study</h1>
        <form
          className="flex flex-col items-center gap-4"
          onSubmit={evt => {
            evt.preventDefault()
            setQueryString({ page: '1', q: rawSearch })
          }}
        >
          <span className="label-text text-lg">Search Term(s)</span>
          <input
            type="text"
            className="input input-bordered"
            placeholder="type 2 diabetes"
            value={rawSearch}
            onChange={evt => {
              setRawSearch(evt.currentTarget.value)
            }}
          />
          <button
            type="submit"
            className="btn normal-case"
          >Search GEO</button>
        </form>
        <p className="prose p-2">
          try an example:&nbsp;
          {examples.flatMap((example, i) => [
            i > 0 ? <React.Fragment key={i}>, </React.Fragment> : null,
            <a
              key={example}
              className="font-bold text-sm cursor-pointer"
              onClick={() => {setQueryString({ page: '1', q: example })}}
            >{example}</a>
          ])}
        </p>
      </HomeLayout>
    )
  } else {
    return (
      <>
        <div className='flex-col'>
          <form
            className="flex flex-row items-center gap-2 mt-5"
            onSubmit={evt => {
              evt.preventDefault()
              setQueryString({ page: '1', q: rawSearch })
            }}
          >
            <span className="label-text text-lg">Search Term(s)</span>
            <input
              type="text"
              className="input input-bordered"
              placeholder="type 2 diabetes"
              value={rawSearch}
              onChange={evt => {
                setRawSearch(evt.currentTarget.value)
              }}
            />
            <button
              type="submit"
              className="btn normal-case"
            >Search GEO</button>
            <div className='ml-10'>Query GEO and receive gene sets extracted from the returned studies.</div>
          </form>
          <p className="prose p-2">
            try an example:&nbsp;
            {examples.flatMap((example, i) => [
              i > 0 ? <React.Fragment key={i}>, </React.Fragment> : null,
              <a
                key={example}
                className="font-bold text-sm cursor-pointer"
                onClick={() => {setQueryString({ page: '1', q: example })}}
              >{example}</a>
            ])}
          </p>
        </div>
        {queryString.q ? <GEOSearchResults search={queryString.q} /> : null}
      </>
    )
  }
}


