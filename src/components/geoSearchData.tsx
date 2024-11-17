import React from 'react';
import { GetGseInfoByIdsDocument, GetGseInfoByIdsQuery } from '@/graphql';
import { useQuery } from '@apollo/client';
import GseTable from './geoTable';
import Loading2 from './loading2';

export default function GseSearchData({ gse_terms, gses, gene_set_ids }: 
  { gse_terms?: Map<string, string[]>, gses?: (string | null | undefined)[], gene_set_ids?: Map<string, string[]>}) {
  
  const { data: geoMeta, loading, error } = useQuery<GetGseInfoByIdsQuery>(GetGseInfoByIdsDocument, {
    variables: { gseids: gses },
  });
  console.log("gses", gses)

  if (loading) return <Loading2 />; 

  if (geoMeta?.getGseInfoByIds?.nodes == undefined || geoMeta.getGseInfoByIds?.nodes.length < 1) return <></>;

  return (
    <>
      <GseTable data={geoMeta.getGseInfoByIds?.nodes} terms={gse_terms} gene_set_ids={gene_set_ids} />
    </>
  );
}

