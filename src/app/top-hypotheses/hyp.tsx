import React, {useState} from 'react'
import {
  useViewRankedSets3Query, 
} from '@/graphql'
import Loading2 from '@/components/loading2'
import Pagination from '@/components/pagination'
import partition from '@/utils/partition'
import { RiAiGenerate } from 'react-icons/ri'
import { UUID } from 'crypto'
import useQsState from '@/utils/useQsState'

const pageSize = 10
type GeneSetModalT =  {
  type: 'GeneSet',
  id: string,
  description: string,
  genes: string[],
} | {
  type: 'GeneSetOverlap2',
  id: UUID,
  genes: string[]
  rummagene: string,
  rummageo: string,
  description: string,

} | undefined


function Breakable(props: { children: string }) {
    return props.children.split('_').map((part, i) => <React.Fragment key={i}>{(i === 0 ? '' : '_') + part}<wbr /></React.Fragment>)
  }

  function description_markdown(text: string) {
    if (!text || text === "None here")  return <span className="italic">No description found</span>
    const m = /\*\*(.+?)\*\*/.exec(text)
    if (m) return <><span>{text.slice(0, m.index)}</span><span className="font-bold italic">{m[1]}</span><span>{text.slice(m.index + 4 + m[1].length)}</span></>
    return text
  }
  


export default function HypothesisResults({ setModalGeneSet, setModalHypothesis, setModalSamples,  setModalCondition,}: {
    setModalGeneSet: React.Dispatch<React.SetStateAction<GeneSetModalT>>,
    setModalHypothesis: React.Dispatch<React.SetStateAction<GeneSetModalT>>;
    setModalSamples: React.Dispatch<React.SetStateAction<string[] | undefined>>;
    setModalCondition: React.Dispatch<React.SetStateAction<string | undefined>>;

}) {

    const [queryString, setQueryString] = useQsState({ page: '1', q: '', species: '' }); // Initialize species

  



    



    const { page, term, species } = React.useMemo(() => ({
      page: queryString.page ? +queryString.page : 1,
      term: queryString.q ?? '',
      species: queryString.species ?? '', // Default species
    }), [queryString]);
  

    const { data: hypResults, loading, error } = useViewRankedSets3Query({
      variables: { range: pageSize, start: (page - 1) * pageSize, filterTerm:term, case: false, species: species},
    });

    const [rawTerm, setRawTerm] = React.useState('')
    React.useEffect(() => {setRawTerm(term)}, [term])

    const [downloading, setDownloading] = useState(false); // Add loading state for downloading

    const handleDownload = async () => {
      setDownloading(true); // Start loading
      // Fetch the download
      const response = await fetch(`/top-hypotheses/download?q=${queryString.q}&species=${queryString.species}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hypresults.tsv'; // Set the desired filename
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url); // Clean up the URL.createObjectURL
      }
      setDownloading(false); // End loading
    };

    
  


    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <table>
            <tbody>
              <tr>
                <td colSpan={7}>
                <Loading2 width={125} height={250} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      
    if (error) return <div>Error loading data: {error.message}</div>;
   
    const totalCount = hypResults?.getPaginatedRankedGeneSets2?.totalCount || 0;

    // console.log(totalCount)


  const currentGeneSets = hypResults?.getPaginatedRankedGeneSets2?.rankedSets ?? [];







  
    return (
   
      <div className="flex flex-col gap-2 my-2">
      <form
        className="join flex flex-row place-content-end place-items-center"
        onSubmit={evt => {
          evt.preventDefault()
          setQueryString({ page: '1', q: rawTerm, species }); // Include species in query string
        }}
      >
        <input
          type="text"
          className="input input-bordered join-item"
          value={rawTerm}
          onChange={evt => {setRawTerm(evt.currentTarget.value)}}
        />
        <select
          className="select select-bordered join-item"
          value={species}
          onChange={evt => {
            const selectedSpecies = evt.currentTarget.value;
            setQueryString({ page: '1', q: rawTerm, species: selectedSpecies }); // Update query string on change
          }}
        >
          <option value="">Select Species</option>
          <option value="human">Human</option>
          <option value="mouse">Mouse</option>
        </select>
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
    onClick={handleDownload} 
    disabled={downloading}
  >
    {!downloading ? <>&#x21E9;</> : null} {}
  </button>
</div>


      </form>
      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>Index</th>
              {/* <th>Rank</th> */}
              <th>Sources</th>
              <th>Titles</th>
              <th>Details</th>
              <th>P Value</th>
              <th>Odds</th>
              <th>Overlap Size</th>
              <th>Hypothesis</th>
            </tr>
          </thead>
          <tbody>
          {/* Map over currentGeneSets for the current page */}
          {currentGeneSets.map((geneSet, index) => {
            if (!geneSet || !geneSet.geneSetById) {
              return null; // or return a placeholder if desired
            }
               const term =`${geneSet.term}`;
               const [rummagene, rummageo] = term.split(";");
               const [paper, _ , termid] = partition(rummagene, '-');
               const [gse, cond1, ra, cond2, dir] = (rummageo ?? '').split("-");
               const direction = (dir ?? '').split(" ")[1];
               const species = (dir ?? '').split(" ")[0];
              const gseTitle = `${geneSet.geneSetById?.gseInfosByGse.nodes[0].title}`;
               const cond1Title = `${geneSet?.geneSetById?.gseInfosByGse.nodes[0].sampleGroups?.titles[cond1]}`;
               const cond2Title = `${geneSet?.geneSetById?.gseInfosByGse.nodes[0].sampleGroups?.titles[cond2]}`;
               const title = `${geneSet?.geneSetById?.pmcInfoByPmc?.title}`;
               const pmcid = geneSet.geneSetById?.pmcInfoByPmc?.pmc;
               const description =`${geneSet?.description}`;
               const odds= geneSet?.geneSetById?.odds as number;
               const pval = geneSet?.geneSetById?.pvalue === 0 ? '<1e-324' : geneSet?.geneSetById?.pvalue ?? 0;
               const rummagene_S = `${geneSet?.geneSetById?.rummageneSize}`;
               const rummageo_S = `${geneSet?.geneSetById?.rummageoSize}`;
               const gen = geneSet.geneSetById?.genes.nodes.map(node => node.symbol) as string[];
               const m = termid ? /^(.+?\.\w+)-+(.+)$/.exec(termid) : null;
               const table = m ? m[1] : '';
               const column = m ? m[2] : termid ?? '';
               const set_id = geneSet.id;
               const gseId = geneSet.geneSetById?.gseInfosByGse.nodes[0].gse;
               const cond1Samples =
               geneSet.geneSetById?.gseInfosByGse.nodes[0].sampleGroups?.samples[cond1] ?? [];
             const cond2Samples =
             geneSet.geneSetById?.gseInfosByGse.nodes[0].sampleGroups?.samples[cond2] ?? [];
               



              return (
                <>
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : ''} border-b border-gray-500`}>

                    <th rowSpan={2}>{(page - 1) * pageSize + index + 1}</th>

                    
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
              
                    <td rowSpan={1}>{title}</td>
              
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
                      <div style={{ marginTop: '10px' }}>
                        <span className="font-bold text-l">{column ? 'Size' : 'No Column'}</span><br />
                        <div>{rummagene_S}</div>
                      </div>
                    </td>
              
                    <td rowSpan={2} style={{ minWidth: '100px', padding: '10px' }}>
                      <div className="mb-2">{pval}</div>
                    </td>
              
                    <td rowSpan={2} style={{ minWidth: '100px', padding: '10px' }}>
                      <div className="mb-2">{odds.toPrecision(3)}</div>
                    </td>
              
                    <td rowSpan={2} style={{ minWidth: '100px', padding: '10px' }}>
                      <div className="mb-2">
                        <label
                          htmlFor="geneSetModal"
                          className="prose underline cursor-pointer"
                          onClick={() => {
                            setModalGeneSet({
                              type: "GeneSet",
                              id: geneSet.id,
                              description: geneSet.term ?? "",
                              genes: gen
                            });
                          }}
                        >
                          {geneSet.nGeneIds}
                        </label>
                      </div>
                    </td>
              
                    <td rowSpan={2}>
                      <div className="tooltip tooltip-left" data-tip="Show generated GPT-4 Hypothesis">
                        <button
                          className="btn btn-sm"
                          onClick={() => {
                            setModalHypothesis({
                              type: "GeneSetOverlap2",
                              id: set_id,
                              rummagene: `${rummagene}`,
                              rummageo: `${rummageo}`,
                              description: `${description}`,
                              genes: gen,
                            });
                          }}
                        >
                          <RiAiGenerate />
                        </button>
                      </div>
                    </td>
                  </tr>
              
                  {/* Second part of the same row */}
                  {/* <tr key={`${index}-geo`} className={`${index % 2 === 0 ? 'bg-gray-100' : ''}`}> */}
                  <tr key={`${index}-geo`} className={`${index % 2 === 0 ? 'bg-gray-100' : ''} border-t-4 border-b-4 border-gray-800 dark:border-white`}>

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
                                setModalSamples(cond1Samples);
                                setModalCondition(cond1Title);
                              }}
                            >
                              {cond1Title}
                            </label>                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <span className="font-bold text-l">Condition 2</span><br />
                          <label
                              htmlFor="geneSetModal"
                              className="prose underline cursor-pointer"
                              onClick={(evt) => {
                                setModalSamples(cond2Samples);
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
                      <div style={{ marginTop: '10px' }}>
                        <span className="font-bold text-l">{column ? 'Size' : 'No Column'}</span><br />
                        <div>{rummageo_S}</div>
                      </div>
                    </td>
                  </tr>
                </>
              );
              

})}
          </tbody>
        </table>
      </div>
      <div className="w-full flex flex-col items-center">
        <Pagination
          page={page}                     
          totalCount={totalCount}
          pageSize={pageSize}
          onChange={page => {
            setQueryString({ page: `${page}`, q: term })
          }}        />
      </div>
    </div>
  );
}



