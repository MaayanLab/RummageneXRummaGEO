import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import markdownit from "markdown-it";
import parse from "html-react-parser";


const processData = (enrichedStats: Record<string, string[]>,
  enrichedStatseo: Record<string, string[]>,
  enrichedStatsi: Record<string, string[]>) => {
 
  const combinedData: Record<
    string,
    {
      term: string;
      sources: Set<string>;
      overlap: number;
      rummagene: number;
      rummageo: number;
    }
  > = {};
  

  // Combine terms from all dictionaries
  [
    { source: "Enriched Stats", data: enrichedStats, color: "blue" },
    { source: "Enriched Statsi", data: enrichedStatsi, color: "orange" },
    { source: "Enriched Statseo", data: enrichedStatseo, color: "red" },
  ].forEach(({ source, data }, idx) => {
    Object.entries(data).forEach(([term, values]) => {
      if (!combinedData[term]) {
        combinedData[term] = {
          term,
          sources: new Set(),
          overlap: 0,
          rummagene: 0,
          rummageo: 0,
        };
      }
      combinedData[term].sources.add(values[9]);
      const keys = ["overlap", "rummagene", "rummageo"] as const;

      combinedData[term][keys[idx]] = -Math.log10(parseFloat(values[2])); 

    });
  });

  // Consolidate terms and prepare final data
  return Object.values(combinedData)
    .map((entry) => ({
      ...entry,
      term: `${entry.term} (${Array.from(entry.sources).join(", ")})`,
    }))
    .sort((a, b) => {
      const totalA = a.overlap + a.rummagene + a.rummageo;
      const totalB = b.overlap + b.rummagene + b.rummageo;
      return totalB - totalA; // Sort by total descending
    });
};

const EnrichedBarChart = ({ enrichedStats, enrichedStatseo, enrichedStatsi } :{
  enrichedStats: Record<string, string[]>,
  enrichedStatseo: Record<string, string[]>,
  enrichedStatsi: Record<string, string[]>

}) => {
  const data = processData(enrichedStats, enrichedStatseo, enrichedStatsi);
  const md = new markdownit();
  const caption = md.render("**Figure 1.** Stacked Bar Plot depicting the distribution of significantly enriched terms among the Rummagene set(yellow), the RummaGEO set(red) and the overlapping set(blue). The top 3 enriched terms from these Enrichr Libraries were used for each set: WikiPathway_2023_Human, GWAS_Catalog_2023, GO_Biological_Process_2023 and MGI_Mammalian_Phenotype_Level_4_2024"
);
  return (
    <div>
    <div style={{ textAlign: "center", fontSize: "18px"}}>
    <strong>Enriched Terms Stacked by Source</strong> {/* Title */}
  </div>
    <ResponsiveContainer width="100%" height={700}>
        
        
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" label={{ value: "-log10(P-value)", position: "insideBottom", offset: -10 }} />
        <YAxis
          type="category"
          dataKey="term"
          width={350}
          tickFormatter={(value) => {
            // Wrap long labels
            return value.length > 190 ? value.match(/.{1,190}/g).join("\n") : value;
          }}
          tick={{ 
            // dy: 10 ,
            fontSize: 14}} 
  tickCount={data.length} 
        />
        <Tooltip />
        <Legend wrapperStyle={{ paddingTop: 20 }} />        
        <Bar dataKey="overlap" stackId="a" fill="blue" name="Overlap" barSize={20}/>
        <Bar dataKey="rummagene" stackId="a" fill="orange" name="Rummagene" barSize={20}/>
        <Bar dataKey="rummageo" stackId="a" fill="red" name="RummaGEO" barSize={20}/>
      </BarChart>
    </ResponsiveContainer>
    <div style={{ textAlign: "center", fontSize: "12px", color: "#666", marginTop: "10px" }}> 
    <strong>{parse(caption)}</strong> 

   </div>
    </div>
  );
};

export default EnrichedBarChart;
