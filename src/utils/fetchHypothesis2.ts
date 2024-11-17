'use server';
import axios from 'axios';

export default async function fetchHypothesis(
  pmTitle: string,
  userDesc: string,
  desct: string,
  desc: string,
  gseTitle: string,
  gseSummary: string,
  cond1: string,
  cond2: string,
  species: string,
  term1: string,
  term2: string,
  enrichedTerms: Record<string, string[]>,
  enrichedStats: Record<string, string[]>
): Promise<string> {
  // Define the system prompt
  const systemPrompt = `You are an AI hypothesis generator for RummagenexRummaGEO (gene sets from crossing Rummagene sets with RummaGEO sets). You should act as a biologist in hypothesizing why a high overlap may exist between a Rummagene set (which are sets from PubMed papers) and a RummaGEO set (automatically generated signatures from Gene Expression Omnibus).`;

  // Build the enriched terms string
  let enrichedTermsString = "";
  Object.keys(enrichedTerms).forEach((library) => {
    enrichedTermsString += `${library}: ${enrichedTerms[library].join(', ')}\n`;
  });

  // Define the main prompt to be sent to the AI
  const prompt = `
    Here are two gene sets that highly overlap. The first is from a Rummagene set. 
    The second is a gene set automatically computed between two conditions in a study from the Gene Expression Omnibus (GEO). 
    Based upon the term name (formatted as condition 1 vs. condition 2) and the abstract of the GEO gene set, 
    and the abstract of the Rummagene gene set, please hypothesize about why these two gene sets have a significant high overlap. 
    You should mention both the summary of the RummaGEO gene set and the description of the Rummagene gene set in your hypothesis. 
    You will also be provided with enrichment results from the Enrichr database to help you generate your hypothesis, which shows 
    significantly overlapping functional terms from the overlapping genes of the two sets. 
    For each enrichment term that appears in your response, the term should appear in the exact form it was given to you 
    (do not exclude any words or characters from a term. For example, Complement And Coagulation Cascades WP558 should appear as 
    Complement And Coagulation Cascades WP558, not Complement And Coagulation Cascades). Also, please don't use quotes around the enriched term names. 
    Gene set term 1 from RummaGEO: ${term2}
    "up" or "dn" in this term name indicates if the genes were upregulated or downregulated in ${cond1} vs ${cond2} conditions in the signature for species ${species}. Please make sure to include this detail in your hypothesis.
    Title of study for gene set term 1: ${gseTitle}
    Summary of study for gene set term 1: ${gseSummary}
    Gene set term 2 from Rummagene: ${term1}
    Title of paper for gene set term 2: ${pmTitle}
    Abstract of paper for gene set term 2: ${userDesc}
    ${desct} is the name of the table from the paper which the gene set comes from and ${desc} is its description. Please include this detail if relevant.
    Enriched Terms from overlapping genes of the two sets:
    ${enrichedTermsString}
  `;

  try {
    // Send the request to the OpenAI API using axios
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 1000000,
      }
    );

    // Check if choices are available in the response
    if (!response.data.choices || response.data.choices.length === 0) {
      throw new Error('No choices returned in the API response.');
    }

    let hypothesis: string = response.data.choices[0].message.content;

    Object.keys(enrichedStats).forEach((term) => {
      if (hypothesis.includes(term)) {
        const details = `Term: ${term}\tLibrary: ${enrichedStats[term][9]}\tRank: ${enrichedStats[term][0]}\tP-value: ${Number(enrichedStats[term][2]).toExponential(2)}\tOdds Ratio: ${Number(enrichedStats[term][3]).toFixed(4)}\n`;
        hypothesis = hypothesis.replaceAll(term, `${term} (${details})`);
      }
    });

    return hypothesis;
  } catch (error) {
    console.error('Error while fetching hypothesis:', error);
    throw error;
  }
}
