import { ViewRankedSetsDocument, ViewRankedSetsQuery } from "@/graphql"
import { getClient } from "@/lib/apollo/client"
import partition from "@/utils/partition"
import streamTsv from "@/utils/streamTsv"


function removeTags(input: string | null | undefined): string {
    const sanitizedInput = input ?? '';
    return sanitizedInput.replace(/[\t\n]/g, '');

}
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {

  const { searchParams } = new URL(request.url)
  const dataset = searchParams.get('species') || ''
  const term = searchParams.get('q') || ''


  const { data: rankedResults, error: rankedResultsError } = await getClient().query<ViewRankedSetsQuery>({
    query: ViewRankedSetsDocument,
    variables: { range:1000, start: 0, filterTerm: term, case: false, species: dataset },
  });

  if (rankedResultsError) {
    console.error("Error fetching ranked results:", rankedResultsError.message);
    throw new Error(rankedResultsError.message);
  }


  const nodes = rankedResults.getPaginatedRankedGeneSets?.rankedSets;

  if (!nodes) {
    throw new Error('No results');
  }


  return new Response(
    streamTsv(
      [
        'rummagene', 'pmcidTitle', 'description', 'rummagene_size', 'rummageo', 'species', 'geoTitle', 
        'condition_1', 'condition_2', 'rummageo_size', 'overlapsize', 
        'oddsRatio', 'pvalue', 'hypothesis',
      ],
      nodes,
      node => {
        const renderedGeneSets = new Set();
        const renderedGeneSets1 = new Set();
    
        if (renderedGeneSets.has(node?.geneSetById?.term)) {
          return null; // Skip this gene set if it's a duplicate
        }
    
        renderedGeneSets.add(node?.geneSetById?.term);
        const item = {
          geneSetHash: node?.geneSetById?.term,  // Use node.term as hash
          pvalue: node?.geneSetById?.pvalue,
          nOverlap: node?.geneSetById?.nGeneIds,
          oddsRatio: node?.geneSetById?.odds,
          rummageoSize: node?.geneSetById?.rummageoSize,
          rummageneSize: node?.geneSetById?.rummageneSize,
          gseInfos: node?.geneSetById?.gseInfosByGse?.nodes?.[0],
          pmcInfo: node?.geneSetById?.pmcInfoByPmc,
          description: node?.geneSetById?.description,
          hypothesis: node?.geneSetById?.hypothesis
        };
    
        if (
          item.geneSetHash &&
          item.pvalue !== undefined &&
          item.oddsRatio !== undefined &&
          item.nOverlap !== undefined &&
          !renderedGeneSets1.has(item?.geneSetHash)
        ) {
          renderedGeneSets1.add(node?.geneSetById?.term);
    
          const term = node?.geneSetById?.term;
          const [rummagene, rummageo] = term?.split(";") ?? ['', ''];
          const [paper, _, termid] = partition(rummagene, '-');
          const [gse, cond1, ra, cond2, dir] = (rummageo ?? '').split("-");
          const geoTitle = node?.geneSetById?.gseInfosByGse?.nodes?.[0]?.title ?? '';
          const condition_1 = node?.geneSetById?.gseInfosByGse?.nodes?.[0]?.sampleGroups?.titles[cond1] ?? '';
          const condition_2 = node?.geneSetById?.gseInfosByGse?.nodes?.[0]?.sampleGroups?.titles[cond2] ?? '';
          const species = (dir ?? '').split(" ")[0];
    
          if (
            rummagene &&
            item.pmcInfo?.title &&
            node?.geneSetById?.term &&
            rummageo &&
            geoTitle &&
            condition_1 &&
            condition_2 &&
            node?.geneSetById?.nGeneIds !== undefined &&
            item.nOverlap !== undefined &&
            item.oddsRatio !== undefined &&
            item.pvalue !== undefined 
          ) {
            return {
              rummagene,
              pmcidTitle: item.pmcInfo?.title ?? '',
              description: item.description ?? '',
              rummagene_size: item.rummageneSize,
              rummageo,
              species,
              geoTitle,
              condition_1,
              condition_2,
              rummageo_size: item.rummageoSize,
              overlapsize: item.nOverlap,
              oddsRatio: item.oddsRatio,
              pvalue: item.pvalue,
              hypothesis: removeTags(item.hypothesis),
            };
          } else {
            return null; 
          }
        } else {
          return null;
        }
      }
    ),
    {
      headers: {
        'Content-Type': 'text/tab-separated-values',
      },
    }
  );
}
