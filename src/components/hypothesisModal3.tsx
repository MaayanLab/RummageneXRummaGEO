import React from "react";
import classNames from "classnames";
import parse from 'html-react-parser';
import {
  useUpdateHypothesisMutation,
  useViewGeneSetQuery} from '@/graphql'
import { UUID } from "crypto";
import { FaRegWindowClose } from "react-icons/fa";


export default function HypothesisModal({
  geneset, 
  rummagene,
  rummageo,
  showModal,
  set_id,
  description,
  setShowModal,
}: {
  geneset?: (string | null)[] | undefined;
  genes?: string[];
  showModal?: boolean;
  rummagene?: string | undefined;
  rummageo?: string | undefined;
  set_id?: UUID | undefined;
  description: string

  setShowModal: (show: boolean) => void;
}) {
  const [hypothesis, setHypothesis] = React.useState<Record<string, string> | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [rated, setRated] = React.useState<boolean>(false); // New state for rating
  const [updateHypothesis, { loading: l, error: er }] = useUpdateHypothesisMutation();
  const {data: geneSet}  = useViewGeneSetQuery({
    variables:
    {id : set_id}
  }
  )

 
      
  const generateHypothesis = React.useCallback(async (t: string) => {
    setLoading(true); // Set loading state to true
    try{
    const newHypothesisi = { ...hypothesis }; // Spread the existing hypothesis

        // Check if the geneSet and its hypothesis are present
    if (geneSet && geneSet.geneSet?.hypothesis) {
        const hypothesisValue = geneSet.geneSet.hypothesis;

      if (hypothesisValue !== null) {
          newHypothesisi[t] = hypothesisValue; 
          setHypothesis(newHypothesisi);
          setLoading(false); 
          return; 
    }
    else{
      newHypothesisi[t] = "Nothing here"; 
      setHypothesis(newHypothesisi);
      setLoading(false); 
      return; 
  }

  }
    setLoading(false);} catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred. Please try again.';
      setError(errorMessage);
      setLoading(false);
  }},

  [geneset, hypothesis, geneSet]);

return (
  <div className="z-40">
    {showModal ? (
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-30 focus:outline-none">
          <div className="relative w-auto my-6 mx-auto max-w-3xl">
            <div
              id="hypothesis-div"
              className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-neutral-900"
            >
              <div className="p-3 border-b flex justify-between items-center">
                <p className="text-md text-center text-gray-900 dark:text-white">
                  Gene Set Overlap (
                  {geneset ? geneset.length : "n"})
                </p>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setShowModal(false)} 
                >
                  <FaRegWindowClose />
                                                
                </button>
              </div>
              <p className="m-4 p-2">
                {(hypothesis && Object.keys(hypothesis || {}).includes(`${rummagene};${rummageo}`)) ? (
                  <>Hypothesis for <i>{`${rummagene};${rummageo}`}</i> </>
                ) : (
                  <>
                  <br />
                  <p className="mt-2">We used the summary of the GEO gene set and its conditions along with the PMC abstract of the rummagene along with highly enriched terms from Enrichr to generate a hypothesis.</p>
                  <>Click the button below to show the hypothesis generated using GPT-4 to help speculate why a significant overlap was found between the rummagene set <i>{`${rummagene}`}</i> and the rummageo set <i>{`${rummageo}`}</i></>
                  </>
                )}
              </p>
              
              {(hypothesis && Object.keys(hypothesis || {}).includes(`${rummagene};${rummageo}`)) ? (
                <div className="flex flex-col text-center justify-center mx-auto">
                  <div className="p-5 m-5 mt-0 text-left border-2 border-slate-300 rounded-lg font-light max-h-96 overflow-y-scroll break-all"
                  
                  >
                    {parse(hypothesis[`${rummagene};${rummageo}`])}
                  </div>
                  
                  <button
                    className="btn btn-sm btn-outline text-xs p-2 m-2"
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(hypothesis[`${rummagene};${rummageo}`].replace(/<[^>]+>/g, ''));
                    }}
                  >
                    
                    Copy to Clipboard
                  </button>
                  {!rated ? (
                    <div>
                      <p className="m-2">Rate the generated hypothesis:</p>
                      <button
                        className="btn btn-sm btn-outline text-xs p-2 m-2"
                        onClick={() => {
                          console.log('Liked!');
                          setRated(true);
                        }}
                      >
                        👍 Like
                      </button>
                      <button
                        className="btn btn-sm btn-outline text-xs p-2 m-2"
                        onClick={() => {
                          console.log('Disliked!');
                          setRated(true);
                        }}
                      >
                        👎 Dislike
                      </button>
                    </div>
                  ) : (
                    <p className="text-green-500">Thank you for your rating!</p>
                  )}
                  <p className="font-extralight text-sm m-2">*Please use caution when interpreting LLM generated hypotheses*</p>
                </div>
              ) : null}

    
                
                <>
                  {(hypothesis && Object.keys(hypothesis || {}).includes(`${rummagene};${rummageo}`)) ? null : (
                    <div className="flex flex-col">
                      <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="btn btn-sm btn-outline text-xs p-2 m-2"
                          onClick={() => generateHypothesis(`${rummagene};${rummageo}`)}
                        >
                          Show Hypothesis
                        </button>
                      </div>
                    </div>
                  )}
                </>
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
    ) : null}
  </div>
);
}