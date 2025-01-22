'use client'
import React from 'react'
import Stats from "@/app/stats";
import { useLatestReleaseQuery } from "@/graphql";
const downloads = [
  {
    url: `https://s3.dev.maayanlab.cloud/rummageogene/rummagenexrummageo.csv.gz`,
    filename: 'rummagenexrummageo.csv.gz',
    title: 'rummagenexrummageo.csv.gz',
    value: '13,419,202 gene sets', 
    size: <><span className="whitespace-nowrap">Approx 6.1GB</span></>,
    updated: new Date("Sun Oct 20 2024"), 
    description: "Contains gmt information along with extra details such as odds ratio and p values"
  },
  {
    url: `https://s3.dev.maayanlab.cloud/rummageogene/data_hyp.json`,
    filename: 'hypotheses.json',
    title: 'hypotheses.json',
    value: 'top 1,000 hypotheses', 
    size: <><span className="whitespace-nowrap">Approx 3.0MB</span></>,
    updated: new Date("Sun Oct 20 2024"), 
    description: ""
  },
  {
    url: `https://s3.dev.maayanlab.cloud/rummageogene/gse_results.json`,
    filename: 'gse_info.json',
    title: 'gse_info.json',
    value: 'rummageo metadata', 
    size: <><span className="whitespace-nowrap">Approx 105MB</span></>,
    updated: new Date("Sun Oct 20 2024"), 
    description: ""
  },
  {
    url: `https://s3.dev.maayanlab.cloud/rummageogene/title_abs.json`,
    filename: 'pmc_info.json',
    title: 'pmc_info.json',
    value: 'rummagene metadata', 
    size: <><span className="whitespace-nowrap">Approx 228.9MB</span></>,
    updated: new Date("Sun Oct 20 2024"), 
    description: ""
  },
  {
    url: `https://s3.dev.maayanlab.cloud/rummageogene/top_1million.csv`,
    filename: 'top_1million.csv',
    title: 'top_1million.csv',
    value: '1,000,000 gene sets', 
    size: <><span className="whitespace-nowrap">Approx 3GB</span></>,
    updated: new Date("Sun Oct 20 2024"), 
    description: ""
  },
]

export default function DownloadClientPage() {
  const { data } = useLatestReleaseQuery()
  const latest_release_date = React.useMemo(() => new Date(data?.releases?.nodes[0]?.created), [data])
  const downloads_with_latest = React.useMemo(() => {
    const downloads_with_latest = [
      ...downloads,

      {
        url: `${process.env.REACT_APP_ENRICH_URL || 'http://127.0.0.1:8000'}/latest/gmt`,
        filename: 'top_1million_sets_on_site.gmt',
        title: 'top_1million_sets_on_site.gmt',
        value: <Stats show_gene_sets />,
        size: <><span className="whitespace-nowrap">Approx 700MB</span></>,
        updated: latest_release_date,
        description: "Contains terms, description and genes for the sets available for analysis on site"
      },
    ]
    downloads_with_latest.sort((a, b) => a.updated < b.updated ? 1 : -1)
    return downloads_with_latest
  }, [latest_release_date])
  return (
    <div className="prose">
      <h2 className="title text-xl font-medium mb-3">Downloads</h2>
      <br /> 
      <div className="grid lg:grid-cols-2 gap-4 my-4">
        {downloads_with_latest.map(download => (
          <a key={download.url} className="stats shadow" href={download.url} download={download.filename}>
            <div className="stat gap-2">
              <div className="stat-title">{download.title}</div>
              <div className="stat-value">{download.value}</div>
              <div className="stat-desc whitespace-normal">
                {download.size}, <span className="whitespace-nowrap">Last Updated {download.updated.toDateString()}</span>
              </div>
              {download.description.length > 0 && (
  <div className="stat-desc whitespace-normal">
    <span className="whitespace-nowrap">{download.description}</span>
  </div>
)}
            </div>
          </a>
        ))}
      </div>
      <p>
        Developed in <a className='underline cursor' href="https://labs.icahn.mssm.edu/maayanlab/">the Ma&apos;ayan Lab</a>
      </p>
      
    </div>
  )
}
