import React, {useState} from 'react'
import {
  FetchUserGeneSetQuery,
  useEnrichmentQueryQuery, 
} from '@/graphql'
import ensureArray from "@/utils/ensureArray"
import Loading from '@/components/loading'
import Loading2 from '@/components/loading2'
import Pagination from '@/components/pagination'
import useQsState from '@/utils/useQsState'
import Stats from '../stats'
import Image from 'next/image'
import partition from '@/utils/partition'
import { UUID } from 'crypto'


const pageSize = 10

type GeneSetModalT = {
  type: 'UserGeneSet',
  description: string,
  genes: string[],
} | {
  type: 'GeneSetOverlap',
  id: string,
  description: string,
  genes: string[]
} | {
  type: 'GeneSet',
  id: string,
  description: string,
} | {
  type: 'GeneSetOverlap2',
  id: string,
  genes: string[]
  gseTitle: string,
  gseSummary: string,
  pmcSummary: string,
  pmcTitle: string,
  species: string,
  cond1Title: string,
  cond2Title: string,
  rummagene: string,
  rummageo: string,
  description: string,
  table_name: string,

} | undefined




function description_markdown(text: string) {
  if (!text || text === "None here") return <span className="italic">No description found</span>
  const m = /\*\*(.+?)\*\*/.exec(text)
  if (m) return <><span>{text.slice(0, m.index)}</span><span className="font-bold italic">{m[1]}</span><span>{text.slice(m.index + 4 + m[1].length)}</span></>
  return text
}

function Breakable(props: { children: string }) {
    return props.children.split('_').map((part, i) => <React.Fragment key={i}>{(i === 0 ? '' : '_') + part}<wbr /></React.Fragment>)
  }




export default function EnrichmentResults({ userGeneSet, setModalGeneSet,   setModalSamples,  setModalCondition,

}: { userGeneSet?: FetchUserGeneSetQuery, 
  setModalGeneSet: React.Dispatch<React.SetStateAction<GeneSetModalT>> ,
  setModalSamples: React.Dispatch<React.SetStateAction<string[]| undefined>>;
  setModalCondition: React.Dispatch<React.SetStateAction<string | undefined>>;

}) {
  const genes = React.useMemo(() =>
    ensureArray(userGeneSet?.userGeneSet?.genes).filter((gene): gene is string => !!gene).map(gene => gene.toUpperCase()),
    [userGeneSet]
  )

  const [queryString, setQueryString] = useQsState({ page:  '1', q: '' })
  const [rawTerm, setRawTerm] = React.useState('')
  const { page, term } = React.useMemo(() => ({ page: queryString.page ? +queryString.page : 1, term: queryString.q ?? '' }), [queryString])
  
  const { data: enrichmentResults } = useEnrichmentQueryQuery({
    skip: genes.length === 0,
    variables: { genes, filterTerm: term, offset: (page-1)*pageSize, first: pageSize },
  })
  React.useEffect(() => {setRawTerm(term)}, [term])
  const [downloading, setDownloading] = useState(false); 

  const handleDownload = async () => {
    setDownloading(true); 
    const response = await fetch(`/enrich/download?dataset=${queryString.dataset}&q=${queryString.q}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'results.tsv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); 
    }
    setDownloading(false); 
  };

  

  return (
    <div className="flex flex-col gap-2 my-2">
      <h2 className="text-md font-bold">
        {!enrichmentResults?.currentBackground?.enrich ?
          <>Rummaging through <Stats show_gene_sets />.</>
          : <>After rummaging through <Stats show_gene_sets />. RummagenexRummaGEO <Image className="inline-block rounded" src="/images/rummagenexrummageo_logo.png" width={50} height={100} alt="RummagenexRummaGEO"></Image> found {Intl.NumberFormat("en-US", {}).format(enrichmentResults?.currentBackground?.enrich?.totalCount || 0)} statistically significant matches.</>}
      </h2>
      <form
        className="join flex flex-row place-content-end place-items-center"
        onSubmit={evt => {
          evt.preventDefault()
          setQueryString({ page: '1', q: rawTerm })
        }}
      >
        <input
          type="text"
          className="input input-bordered join-item"
          value={rawTerm}
          onChange={evt => {setRawTerm(evt.currentTarget.value)}}
        />
        <div className="tooltip" data-tip="Search results">
          <button
            type="submit"
            className="btn join-item"
          >&#x1F50D;</button>
        </div>
        <div className="tooltip" data-tip="Clear search">
          <button
            type="reset"
            className="btn join-item"
            onClick={evt => {
              setQueryString({ page: '1', q: '' })
            }}
          >&#x232B;</button>
        </div>
        <div className="absolute tooltip" data-tip="Download results">
  {downloading && (
    <div className="absolute inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
<Loading2 width={125} height={150} />
</div>
  )}
  <button
    type="button"
    className="btn join-item font-bold text-2xl pb-1"
    onClick={handleDownload} // Add onClick for downloading
    disabled={downloading} // Disable button while downloading
  >
    {!downloading ? <>&#x21E9;</> : null} {/* Show download icon when not loading */}
  </button>
</div>
      </form>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Index</th>
              <th>Sources</th>
              <th>Titles</th>
              <th>Details</th>
              <th>Gene Set Size</th>
              <th>Overlap</th>
              <th>Odds</th>
              <th>P Value</th>
              <th>AdjPValue</th>
              {/* <th>Hypothesis</th> */}
            </tr>
          </thead>
          <tbody>
            {!enrichmentResults?.currentBackground?.enrich ?
              <tr>
                <td colSpan={7}><Loading /></td>
              </tr>
            : null}
            {enrichmentResults?.currentBackground?.enrich?.nodes?.flatMap((enrichmentResult, geneSetIndex) => {
              if (!enrichmentResult?.geneSets) return null
              const terms = {} as Record<string, {
                pmcid: string,
                title: string,
                description: string,
                table: string,
                column: string,
                gseId: string,
                gseTitle: string,
                direction: string,
                species: string,
                cond1Title: string,
                cond2Title: string,
                cond1Sample: string[],
                cond2Sample: string[],
                rummagene: string,
                rummageo: string,
                abs: string,
                sum: string,
                pmcTitle: string,
                id: UUID,
                // index: number,

              }>;
              const renderedIndices = new Set<number>();


              for (const node of enrichmentResult?.geneSets.nodes) {
                const term =  `${node.term}`;
                const [pmc_info, gse_info] = term.split(";");
                const [paper, _ , termid] = partition(pmc_info, '-');
                const [gse, cond1, ra, cond2, dir] = (gse_info ?? '').split("-");
                const direction = (dir ?? '').split(" ")[1];
                const species = (dir ?? '').split(" ")[0];
                const gseTitle = `${node.gseInfosByGse.nodes[0].title}`;
                const cond1Title = `${node?.gseInfosByGse.nodes[0].sampleGroups?.titles[cond1]}`;
                const cond2Title = `${node?.gseInfosByGse.nodes[0].sampleGroups?.titles[cond2]}`;
                const cond1Samples =
                node?.gseInfosByGse.nodes[0].sampleGroups?.samples[cond1] ?? [];

              const cond2Samples =
                node?.gseInfosByGse.nodes[0].sampleGroups?.samples[cond2] ?? [];
                const abstract = `${node?.pmcInfoByPmc?.abstract}`;
                const tite = `${node?.pmcInfoByPmc?.title}`;

                const summary = `${node?.gseInfosByGse.nodes[0].summary}`;
              
                const m = termid ? /^(.+?\.\w+)-+(.+)$/.exec(termid) : null;
                const table = m ? m[1] : '';
                const column = m ? m[2] : termid ?? '';
                const set_id = node.id;

                if (!(term in terms)) {
                  terms[term] = {
                    pmcid:  paper,
                    title:   `${node.pmcInfoByPmc?.title}`,
                    description: node.description ?? '',
                    table: table,
                    column: column,
                    gseId: `${node.gseInfosByGse.nodes[0].gse}`,
                    gseTitle: gseTitle,
                    direction: direction,
                    species: species,
                    cond1Title: cond1Title,
                    cond2Title: cond2Title,
                    cond1Sample: cond1Samples,
                    cond2Sample: cond2Samples,
                    rummagene: pmc_info,
                    rummageo: gse_info,
                    abs: abstract,
                    sum: summary,
                    pmcTitle:tite ,
                    id : set_id,
                  };
                }
            
              }

              return Object.entries(terms).flatMap(([term, { rummagene, rummageo, pmcid, title, description, table, column, gseId, gseTitle, direction, species, cond1Title, cond2Title, cond1Sample, cond2Sample , abs, sum, pmcTitle, id}]) => {
                // Skip if this geneSetIndex has already been rendered
                const genesetIndex = geneSetIndex + (page - 1) * pageSize;
                


                if (renderedIndices.has(genesetIndex)) {
                  return null;
                }
            
                // Mark this geneSetIndex as rendered
                renderedIndices.add(genesetIndex);
            
                return [
                  // First Row for Term
                  // <>
                  // {/* Apply gray background for even rows based on the index */}
                  // <tr key={index} className={`${index % 2 == 0 ? 'bg-gray-100' : ''}`}>
                  <tr key={`${genesetIndex}-${term}`}  className={`${genesetIndex % 2 === 0 ? 'bg-gray-100' : ''} border-b-4 border-gray-800 dark:border-white`}>
                    <th rowSpan={2} className="text-center">{genesetIndex + 1}</th>
                    {/* Term and PMCID */}
                    <th rowSpan={1}>
                      <div className="mb-2">
                        <span className="font-bold text-xl">Rummagene</span><br />
                        <a
                          className="underline cursor-pointer"
                          href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {pmcid}
                        </a>
                      </div>
                    </th>
                    {/* Title */}
                    <td rowSpan={1}>{title}</td>
                    {/* Table and Column Data */}
                    <td rowSpan={1}>
                      <div>
                        <span className="font-bold text-l">Table</span><br />
                        <a
                          className="underline cursor-pointer"
                          href={`https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/bin/${table}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Breakable>{table}</Breakable>
                        </a>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <span className="font-bold text-l">{column ? 'Column' : 'No Column'}</span><br />
                        <div>{column}</div>
                      </div>
                      <div style={{ marginTop: '10px' }}>
                        <span className="font-bold text-l">{column ? 'Description' : 'No Column'}</span><br />
                        <div>{description_markdown(description)}</div>
                      </div>
                    </td>
                    <td rowSpan={2}>
                      <div>
                        <label
                          htmlFor="geneSetModal"
                          className="prose underline cursor-pointer"
                          onClick={() => {
                            setModalGeneSet({
                              type: "GeneSet",
                              id: enrichmentResult?.geneSets.nodes[0].id,
                              description: enrichmentResult?.geneSets.nodes[0].term ?? "",
                            });
                          }}
                        >
                          {enrichmentResult?.geneSets.nodes[0].nGeneIds}
                        </label>
                      </div>
                    </td>
                    {/* Odds Ratio */}
                    <td rowSpan={2}>
                      <div key={enrichmentResult?.geneSets.nodes[0].id}>
                        <label
                          htmlFor="geneSetModal"
                          className="prose underline cursor-pointer"
                          onClick={evt => {
                            setModalGeneSet({
                              type: 'GeneSetOverlap',
                              id: enrichmentResult?.geneSets.nodes[0]?.id,
                              description: `${userGeneSet?.userGeneSet?.description || 'User gene set'} & ${enrichmentResult.geneSets.nodes[0].term || 'RummagenexRummaGEO gene set'}`,
                              genes: genes,
                            })
                          }}
                        >
                          {enrichmentResult?.nOverlap}
                        </label>
                      </div>
                    </td>
                    <td rowSpan={2}>{enrichmentResult?.oddsRatio?.toPrecision(3)}</td>
                    <td rowSpan={2} style={{ width: '70px' }}>{enrichmentResult?.pvalue?.toPrecision(3)}</td>
                    <td rowSpan={2}>{enrichmentResult?.adjPvalue?.toPrecision(3)}</td>
                  </tr>,
            
                  // Second Row for GEO ID and Additional Details
                  // <tr key={`${genesetIndex}-${term}-geo`} className="border-b-4 border-gray-800 dark:border-white">
                  <tr key={`${genesetIndex}-${term}-geo`}  className={`${geneSetIndex% 2 === 0 ? 'bg-gray-100' : ''} border-b-4 border-gray-800 dark:border-white`}>

                    <th rowSpan={1}>
                      <div className="mb-2">
                        <span className="font-bold text-xl">RummaGEO</span><br />
                        {gseId ? (
                          <a
                            className="underline cursor-pointer"
                            href={`https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${gseId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {gseId}
                          </a>
                        ) : null}
                      </div>
                    </th>
                    {/* GEO Title */}
                    <td rowSpan={1}>
                      <div>
                        <span className="font-bold text-xl"></span><br />
                        {gseTitle ? gseTitle : "No title available"}
                      </div>
                    </td>
                    <td rowSpan={1}>
                      <div>
                        <div style={{ marginBottom: '10px' }}>
                          <span className="font-bold text-l">Species</span><br />
                          {species === 'mouse' ? 'Mouse' : species === 'human' ? 'Human' : species}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <span className="font-bold text-l">Condition 1</span><br />
                          <label
                              htmlFor="geneSetModal"
                              className="prose underline cursor-pointer"
                              onClick={(evt) => {
                                setModalSamples(cond1Sample);
                                // setModalSamples(cond1Sample ? [cond1Sample] : undefined);
                                setModalCondition(cond1Title);
                              }}
                            >
                              {cond1Title}
                            </label>
                          
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <span className="font-bold text-l">Condition 2</span><br />
                          <label
                              htmlFor="geneSetModal"
                              className="prose underline cursor-pointer"
                              onClick={(evt) => {
                                setModalSamples(cond2Sample);
                                // setModalSamples(cond2Sample ? [cond1Sample] : undefined);

                                setModalCondition(cond2Title);
                              }}
                            >
                              {cond2Title}
                            </label>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <span className="font-bold text-l">Direction</span><br />
                          {direction === 'dn' ? 'Down' : direction === 'up' ? 'Up' : direction}
                        </div>
                      </div>
                    </td>
                  </tr>,
                ];
              });
            })}
             
                      
              
            
          </tbody>
        </table>
      </div>
      {enrichmentResults?.currentBackground?.enrich ?
        <div className="w-full flex flex-col items-center">
          <Pagination
            page={page}
            totalCount={enrichmentResults?.currentBackground?.enrich?.totalCount ? enrichmentResults?.currentBackground?.enrich.totalCount : undefined}
            pageSize={pageSize}
            onChange={page => {
              setQueryString({ page: `${page}`, q: term })
            }}
          />
        </div>
      : null}
    </div>
  )
}






