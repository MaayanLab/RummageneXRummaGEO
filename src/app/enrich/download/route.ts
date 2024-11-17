import { EnrichmentQueryDocument, EnrichmentQueryQuery, FetchUserGeneSetDocument, FetchUserGeneSetQuery } from "@/graphql"
import { getClient } from "@/lib/apollo/client"
import ensureArray from "@/utils/ensureArray"
import partition from "@/utils/partition"
import streamTsv from "@/utils/streamTsv"
import example from '@/app/example.json'

export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dataset = searchParams.get('dataset')
  const term = searchParams.get('q') || ''

  let userGeneSet: FetchUserGeneSetQuery["userGeneSet"];
  
  // Conditionally use example.json if dataset is 'example'
  if (dataset === "example") {
    userGeneSet = {
      genes: example.genes, // Using the genes from example.json
      description: "Example Gene Set",
    };
  } else {
    const { data, error: userGeneSetError } = await getClient().query<FetchUserGeneSetQuery>({
      query: FetchUserGeneSetDocument,
      variables: { id: dataset },
    });
    if (userGeneSetError) throw new Error(userGeneSetError.message);
    userGeneSet = data.userGeneSet;
  }

  const genes = ensureArray(userGeneSet?.genes).filter((gene): gene is string => !!gene).map(gene => gene.toUpperCase());

  const { data: enrichmentResults, error: enrichmentResultsError } = await getClient().query<EnrichmentQueryQuery>({
    query: EnrichmentQueryDocument,
    variables: {
      genes,
      filterTerm: term,
      offset: 0,
      first: null, 
    },
  })
  if (enrichmentResultsError) throw new Error(enrichmentResultsError.message)
  const nodes = enrichmentResults.currentBackground?.enrich?.nodes
  if (!nodes) throw new Error('No results')
  return new Response(
    streamTsv(
      [
        'rummagene', 'pmcidTitle', 'description', 'rummageo', 'species','geoTitle', 
        'condition_1', 'condition_2', 'direction','geneSetSize', 'nOverlap', 
        'oddsRatio', 'pvalue', 'adjPvalue', 'geneSetHash'
      ],
      nodes.flatMap(node => {
        const renderedGeneSets = new Set();
        const renderedGeneSets1 = new Set();

        return node?.geneSets.nodes.flatMap(geneSet => {
          // const geneSetHash = `${geneSet.term}-${node.geneSetHash}`;
          if (renderedGeneSets.has(node.geneSetHash)) {
            return []; // Skip this gene set if it's a duplicate
          }
          renderedGeneSets.add(node.geneSetHash);
  
          const item = {
            geneSetHash: node.geneSetHash,
            geneSet,
            pvalue: node.pvalue,
            adjPvalue: node.adjPvalue,
            nOverlap: node.nOverlap,
            oddsRatio: node.oddsRatio,
          };
  
          // Return only if all required fields are present
          if (
            item.geneSet &&
            item.pvalue !== undefined &&
            item.adjPvalue !== undefined &&
            item.nOverlap !== undefined &&
            item.oddsRatio !== undefined &&
            !renderedGeneSets1.has(item?.geneSetHash)
          ) {
            renderedGeneSets1.add(node.geneSetHash);
            return item;
          } else {
            return []; // Skip if any essential field is missing
          }
        });
      }),
      item => {
        if (!item?.geneSet) return;
  
        const term = item.geneSet.term;
        const [rummagene, rummageo] = term.split(";");
        const [paper, _, termid] = partition(rummagene, '-');
        const [gse, cond1, ra, cond2, dir] = (rummageo ?? '').split("-");
        const direction = (dir ?? '').split(" ")[1];
        const species = (dir ?? '').split(" ")[0];
        const geoTitle = `${item.geneSet.gseInfosByGse.nodes[0].title}`;
        const condition_1 = `${item.geneSet?.gseInfosByGse.nodes[0].sampleGroups?.titles[cond1]}`;
        const condition_2 = `${item.geneSet.gseInfosByGse.nodes[0].sampleGroups?.titles[cond2]}`;
        const m = termid ? /^(.+?\.\w+)-+(.+)$/.exec(termid) : null;
      
  
        // Skip if any required value is missing
        if (
          rummagene &&
          item.geneSet.pmcInfoByPmc?.title &&
          item.geneSet.description &&
          rummageo &&
          geoTitle &&
          condition_1 &&
          condition_2 &&
          item.geneSet.nGeneIds !== undefined &&
          item.nOverlap !== undefined &&
          item.oddsRatio !== undefined &&
          item.pvalue !== undefined &&
          item.adjPvalue !== undefined &&
          item.geneSetHash
        ) {
          return {
            rummagene,
            pmcidTitle: item.geneSet.pmcInfoByPmc?.title,
            description: item.geneSet.description,
            rummageo,
            species,
            geoTitle,
            condition_1,
            condition_2,
            direction,
            geneSetSize: item.geneSet.nGeneIds,
            nOverlap: item.nOverlap,
            oddsRatio: item.oddsRatio,
            pvalue: item.pvalue,
            adjPvalue: item.adjPvalue,
            geneSetHash: item.geneSetHash,
          };
        } else {
          return null; // Skip the entire item if any key value is missing
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
