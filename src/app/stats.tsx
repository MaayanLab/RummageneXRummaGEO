'use client'
import { useStatsQuery, useNumEnquiriesQuery } from '@/graphql'
import classNames from 'classnames'

export default function Stats({
  bold,
  show_sets_analyzed,
  show_gene_sets,
  show_pmcs,
  show_publications,
  show_gse_mouse,
  show_gse_human,
  show_pmc_term,
  show_unique_term,
}: {
  bold?: boolean,
  show_sets_analyzed?: boolean,
  show_gene_sets?: boolean,
  show_pmcs?: boolean,
  show_publications?: boolean,
  show_gse_human?:boolean,
  show_gse_mouse?:boolean,
  show_pmc_term?:boolean,
  show_unique_term?:boolean
}) {
  const { data } = useStatsQuery({ pollInterval: 60000 })
  const {data: lal} = useNumEnquiriesQuery({});

  if (show_gene_sets) {
    return (data?.geneSets?.totalCount !== undefined && show_gene_sets) ? <><span className={classNames({'font-bold': bold})}>{Intl.NumberFormat("en-US", {}).format(data.geneSets.totalCount)}</span>&nbsp;gene sets</> : <span className='loading'>loading</span>
  } else if (show_pmcs){
    return (data?.pmcs?.totalCount !== undefined ? <><span className={classNames({'font-bold': bold})}>{Intl.NumberFormat("en-US", {}).format(data.pmcs.totalCount)}</span>&nbsp;articles</> : <span className='loading'>loading</span>)
  } else if (show_publications) {
    return (data?.pmcStats?.nPublicationsProcessed !== undefined ? <><span className={classNames({'font-bold': bold})}>{Intl.NumberFormat("en-US", {}).format(data.pmcStats.nPublicationsProcessed)}</span>&nbsp;PMC articles</> : <span className='loading'>loading</span>) 
  } else if (show_sets_analyzed) {
    return (data?.counterTable?.count !== undefined ? <><span className={classNames({'font-bold': bold})}>{Intl.NumberFormat("en-US", {}).format(data?.counterTable?.count ?? 0)}</span>&nbsp;sets analyzed</> : <span className='loading'>loading</span>)
  }
//   return (data?.counterTable?.count !== undefined ? <><span className={classNames({'font-bold': bold})}>{Intl.NumberFormat("en-US", {}).format(lal?.counterTable.)}</span>&nbsp;sets analyzed</> : <span className='loading'>loading</span>)
// }
  else if (show_pmc_term) {
    return (data?.pmcTermStats?.nodes[0] !== undefined ? <><span className={classNames({'font-bold': bold})}>{Intl.NumberFormat("en-US", {}).format(data.pmcTermStats.nodes[0].uniqueTermPartsCount)}</span>&nbsp;Rummagene gene sets</> : <span className='loading'>loading</span>)
  }
  else if (show_unique_term) {
    return (data?.uniqueTermCounts?.nodes[0] !== undefined ? <><span className={classNames({'font-bold': bold})}>{Intl.NumberFormat("en-US", {}).format(data.uniqueTermCounts.nodes[0].uniqueTermCount)}</span>&nbsp;gene set pairs</> : <span className='loading'>loading</span>)
  }

  else if (show_gse_mouse) {
    const mouseNode = data?.gseStats?.nodes?.find((node) => node.species === 'mouse');
    
    return (
      mouseNode !== undefined ? (
        <>
          <span className={classNames({ 'font-bold': bold })}>
            {Intl.NumberFormat("en-US", {}).format(mouseNode.nOccurrencesProcessed)}
          </span>
          &nbsp;RummaGEO mouse gene sets 
        </>
      ) : (
        <span className='loading'>loading</span>
      )
    );
  }
  // else if (show_gse_human){
  //   return (data?.gseStats?.nodes !== undefined ? <><span className={classNames({'font-bold': bold})}>{Intl.NumberFormat("en-US", {}).format(data.gseStats.nodes[1].nOccurrencesProcessed)}</span>&nbsp;sets analyzed</> : <span className='loading'>loading</span>)
  // }
  else if (show_gse_human) {
    const humanNode = data?.gseStats?.nodes?.find((node) => node.species === 'human');
    
    return (
      humanNode !== undefined ? (
        <>
          <span className={classNames({ 'font-bold': bold })}>
            {Intl.NumberFormat("en-US", {}).format(humanNode.nOccurrencesProcessed)}
          </span>
          &nbsp;RummaGEO human gene sets
        </>
      ) : (
        <span className='loading'>loading</span>
      )
    );
  }
  

  else{
    return null
  }
}
