import React from 'react'
import { GetPmcInfoByIdsDocument, GetPmcInfoByIdsQuery } from '@/graphql';
import { useSuspenseQuery, useQuery } from '@apollo/client';
import PmcTable from './pmcTable';
import Loading2 from './loading2';

export default function PmcSearchData({ pmc_terms, pmcs, gene_set_ids}: 
  { pmc_terms?: Map<string, string[]>, pmcs?: (string | null | undefined)[], gene_set_ids?: Map<string, string[]>}) {

  const { data: pmcMeta , loading, error} = useQuery<GetPmcInfoByIdsQuery>(GetPmcInfoByIdsDocument, {
    variables: { pmcids: pmcs },
  })

  if (loading) return <Loading2 />; 

  if (pmcMeta?.getPmcInfoByIds?.nodes == undefined) return <></>
  if (pmcMeta.getPmcInfoByIds?.nodes?.length < 1) return <></>

  return (
    <>
      <PmcTable data={pmcMeta.getPmcInfoByIds?.nodes} terms={pmc_terms} gene_set_ids={gene_set_ids}></PmcTable>
    </>
  )
}
