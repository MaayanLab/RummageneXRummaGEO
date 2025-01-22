import React from "react";
import classNames from "classnames";
import parse from 'html-react-parser';
import {
  useViewGeneSetQuery, useUpdateRatingsMutation} from '@/graphql'
import { UUID } from "crypto";
import { FaRegWindowClose } from "react-icons/fa";
import getEnrichrTerms from "@/utils/getEnrichrTerms";
import markdownit from 'markdown-it'
import EnrichedBarChart from "./generateBarI";
import Loading2 from "./loading2";


function generateHtml({hypothesis, name, hypothesisTitle, geneSize, ovaSize, geoSize, pval, enricher, enrichGEO, enrichgene, userListIdgene, userListIdgeo} : 
  {hypothesis?: string | undefined; 
    enricher?: string | undefined; 
    name?: string | undefined; 
    hypothesisTitle?: string | undefined; 
    pval?: string | undefined; 
    geneSize?: string| undefined;
    ovaSize?: string| undefined;
    geoSize?: string| undefined;
    enrichGEO?: string | undefined; 
    enrichgene?: string | undefined; 
    userListIdgene?: string | undefined; 
    userListIdgeo?: string | undefined; 
  }) {
      
  let htmlContent = '';
  const safeName = name ?? "";
  htmlContent += `
        <div className="font-bold mb-4 text-justify">
        <h2><strong>${hypothesisTitle}</strong></h2> 
        </div>  
        
        <div>
        <p>
        <strong></>
        <href></>


        <strong>Rummagene set:</strong> 
<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/${safeName.split(";")[0].split("-")[0]}" target="_blank" style="color: blue; text-decoration: underline;">
${safeName.split(";")[0]}
          </a>
        </p>
        <p><strong>RummaGEO set:</strong>
          <a href="https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${safeName.split(";")[1].split("-")[0]}" target="_blank" style="color: blue; text-decoration: underline;">
${safeName.split(";")[1]}          </a>
        </p>
        </div>
        
        <p><strong>Rummagene set size:</strong>
                   <a href="${enrichgene}" target="_blank" style="color: blue; text-decoration: underline;">${geneSize}</a>; 
                   <strong>RummaGEO set size:</strong> 
                   <a href="${enrichGEO}" target="_blank" style="color: blue; text-decoration: underline;">${geoSize}</a></p>
        <p><strong>Overlap set size:</strong>
                  <a href="${enricher}" target="_blank" style="color: blue; text-decoration: underline;"> ${ovaSize}</a>; <strong>p-value:</strong> ${Number(pval) === 0 ? "<1e-324" : pval}
        
        </p>
        </div>
        

    `;
    const md = new markdownit();

    const parts = hypothesis?.split("\n\n") ?? [];
    parts.forEach((part, index) => {
    
      htmlContent += `<p>${md.render(part)}</p>`;


    });
  

  return htmlContent;
}


export default function HypothesisModal({
  geneset, 
  rummagene,
  rummageo,
  showModal,
  set_id,
  setShowModal,
}: {
  geneset?: (string | null)[] | undefined;
  genes?: string[];
  showModal?: boolean;
  rummagene?: string | undefined;
  rummageo?: string | undefined;
  set_id?: UUID | undefined;

  setShowModal: (show: boolean) => void;
}) {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [rated, setRated] = React.useState<boolean>(false); 
  const [selectedRating, setSelectedRating] = React.useState(0); 
  const [updateRatingsMutation, { 
    data: updateRatingsData, 
    loading: updateRatingsLoading, 
    error: updateRatingsError 
  }] = useUpdateRatingsMutation();
 
  const handleClick = (e: any, starValue: any) => {  //starValue is number e is Mouse event
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const width = rect.width;
  const isHalf = x < width / 2;
  console.log()

    setSelectedRating(isHalf ? starValue - 0.5 : starValue);
  };




  const {data: geneSet, loading: geneSetLoading}  = useViewGeneSetQuery({
    variables:
    {id : set_id}
  });
  const handleSubmit = async () => {
    setRated(true);
    try {
      await updateRatingsMutation({
        variables: {
          id: set_id,
          rating: Number(selectedRating)
          
        }
      });
    } catch (err) {
      console.error("Error updating ratings:", err);
      setError("Failed to update ratings");
    }
  };
 
  const hypothesis  = geneSet?.geneSet?.hypothesis ?? '';

  const hypothesisTitle = geneSet?.geneSet?.hypothesisTitle ?? '';
  const [_, enrichGEO, enrichgene, userListIdova,userListIdgene, userListIdgeo] = (geneSet?.geneSet?.enrichLinks ?? "").split(";") ?? [""];

  const enricher = `${_}` ;
  const pval = `${geneSet?.geneSet?.pvalue}` ;
  const geneSize = `${geneSet?.geneSet?.rummageneSize}` ;
  const geoSize = `${geneSet?.geneSet?.rummageoSize}` ;
  const ovaSize = `${geneSet?.geneSet?.nGeneIds}` ;
  const hypothesisRate = geneSet?.geneSet?.hypothesisRating ?? 0;
  const hypothesisRateCounts = geneSet?.geneSet?.ratingCounts;
  const name = `${rummagene};${rummageo}` ?? "";
  const htmlContent = generateHtml({hypothesis, name, hypothesisTitle, pval, geneSize, ovaSize, geoSize,  enricher, enrichGEO, enrichgene, userListIdgene, userListIdgeo})
  const [enrichedStats, setEnrichedStats] = React.useState<Record<string, string[]> | null>(null);
  const [enrichedStatseo, setEnrichedStatseo] = React.useState<Record<string, string[]> | null>(null);
  const [enrichedStatsi, setEnrichedStatsi] = React.useState<Record<string, string[]> | null>(null);
 

  const enrichrLibraries = [
    'WikiPathway_2023_Human',
    'GWAS_Catalog_2023',
    'GO_Biological_Process_2023',
    'MGI_Mammalian_Phenotype_Level_4_2024'
  ];

  const generateEnriched = React.useCallback(async () => {
    try {
      const [stats, statseo, statsi] = await Promise.all([
        getEnrichrTerms(userListIdova, enrichrLibraries),
        getEnrichrTerms(userListIdgeo, enrichrLibraries),
        getEnrichrTerms(userListIdgene, enrichrLibraries),
      ]);
  
     
      setEnrichedStats(stats);
      setEnrichedStatseo(statseo);
      setEnrichedStatsi(statsi);
      setShowModal(true);
  
      
    } catch (error) {
      console.error('Error generating enriched data:', error);
    }
  }, [userListIdova, userListIdgeo, userListIdgene, enrichrLibraries]);
  
  React.useEffect(() => {
    generateEnriched();
  }, [generateEnriched]);
    



return (
  <div className="z-40">
    {showModal ? (
      enrichedStats && enrichedStatseo && enrichedStatsi && 
      Object.keys(enrichedStats).length > 0 &&
      Object.keys(enrichedStatseo).length > 0 &&
      Object.keys(enrichedStatsi).length > 0 ? (
        <>
          <div className="fixed inset-0 z-30 flex justify-center items-center bg-black bg-opacity-50 focus:outline-none">
            {/* <div className="relative w-full h-full overflow-y-scroll "> */}
            <div className="relative w-full h-full">

              <div
                id="hypothesis-div"
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-white outline-none focus:outline-none dark:bg-neutral-900 border-4 border-black dark:border-white"
              >
                {/* Modal Header */}
                <div className="p-3 border-b flex justify-between items-center">
                  <p className="text-md text-center text-gray-900 dark:text-white">
                    Gene Set Overlap ({geneset ? geneset.length : "n"})
                  </p>
                  <button
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => setShowModal(false)}
                  >
                    <FaRegWindowClose />
                  </button>
                </div>
                
                {/* Hypothesis Content */}
                <div className="m-4 p-2">
                  <div className="flex flex-col text-center justify-center mx-auto">
                    <div className="p-2 m-2 mt-0 text-left border border-slate-300 rounded-lg font-light max-h-[54vh] overflow-y-scroll break-all">
                      {parse(htmlContent)}
                      <EnrichedBarChart
                        enrichedStats={enrichedStats}
                        enrichedStatseo={enrichedStatseo}
                        enrichedStatsi={enrichedStatsi}
                      />
                    </div>
                    <button
                      className="btn btn-sm btn-outline text-xs p-2 m-2"
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          htmlContent.replace(/<[^>]+>/g, '')
                        );
                      }}
                    >
                      Copy to Clipboard
                    </button>

                    {/* Rating Section */}
                    {!rated ? (
                      <div>
                        <p>
                          <strong>Current Rating:</strong>{" "}
                          {(Math.round(hypothesisRate * 100) / 100).toFixed(2)} |{" "}
                          <strong>Total Ratings:</strong> {hypothesisRateCounts}
                        </p>
                        <p className="m-2">Please rate the generated hypothesis:</p>

                        <div className="flex items-center justify-center space-x-2 px-10">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div
                              key={star}
                              className="relative w-8 h-8 cursor-pointer"
                              onClick={(e) => handleClick(e, star)}
                            >
                              <span
                                className={`absolute text-3xl transition-colors ${  //full start
                                  selectedRating >= star ? "text-yellow-500" : "text-gray-400"
                                }`}
                              >
                                ★
                              </span>
                              {selectedRating >= star - 0.5 && selectedRating < star ? ( //half star
                                <span
                                  className="absolute text-3xl transition-colors text-yellow-500"
                                  style={{ clipPath: "inset(0 50% 0 0)" }}
                                >
                                  ★
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>

                        <button
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                          onClick={handleSubmit}
                        >
                          Submit Rating
                        </button>
                      </div>
                    ) : (
                      <p className="text-green-500">
                        Thank you for your {selectedRating} star rating!
                      </p>
                    )}
                    <p className="font-extralight text-sm m-2">
                      *Please use caution when interpreting LLM-generated hypotheses*
                    </p>
                  </div>
                </div>
                {/* Error or Loading Section */}
                <div className="flex flex-col justify-center text-center mx-auto">
                  <span
                    className={classNames("loading", "w-6", {
                      hidden: !loading,
                    })}
                  ></span>
                  <div
                    className={classNames("alert alert-error w-fit m-2 mt-0", {
                      hidden: !error,
                    })}
                  >
                    {error ?? null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="fixed inset-0 z-30 flex justify-center items-center bg-black bg-opacity-50 focus:outline-none">
<Loading2 width={125} height={150} />
</div>
      )
    ) : null}
  </div>
);

}