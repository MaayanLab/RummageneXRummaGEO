import React from 'react'
import Image from "next/image"
import Stats from "../stats"
import Link from "next/link"
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(props: {}, parent: ResolvingMetadata): Promise<Metadata> {
  const parentMetadata = await parent
  return {
    title: `${parentMetadata.title?.absolute} | About`,
    keywords: parentMetadata.keywords,
  }
}

export default async function About() {
  return (
    <div className="prose">
      <h2 className="title text-xl font-medium mb-3">About RummagenexRummaGEO</h2>
      <div className="flex">
        <div className="flex-col">
        <Image className={'rounded float-right ml-5'} src={'/images/rummagenexrummageo_logo.png'} width={250} height={250} alt={'RummagenexRummaGEO'}></Image>
        <p>Recently, the Ma'ayan Lab developed two new resources: Rummagene and RummaGEO. Rummagene is a web server application that provides access to over 750,000 gene sets extracted from supporting materials of 140,000+ articles after scanning 6 million articles available on PubMed Central. 
          Similarly, RummaGEO is a web server application that automates extracting and categorizing over 300,000 human and mouse gene sets from the Gene Expression Omnibus (GEO) for comprehensive gene expression signature search. </p>
         <p style={{ marginTop: '20px' }}>Since these two new resources produced massive collections of independent annotated gene sets, we sought to cross them to discover gene sets that highly overlap but originate from different seemingly unrelated studies. 
          In total, we intersected 748,220  gene sets from Rummagene with 158,062 RummaGEO mouse gene sets and 135,264 RummaGEO human gene sets. This comparison led to the discovery of over 16 million gene set pairs that show high overlap (p-value &lt; 0.001). The top 1 million sets (by p value and odds ratio) are stored in a database and made available for search via the RummagenexRummaGEO website. In addition to providing the overlapping pairs for search, we generated hypotheses for the top 1000 sets (by p value and odds ratio) which are also availabe on the site.</p>
          <p style={{ marginTop: '20px' }}>Furthermore, the top overlapping sets with abstract dissimilarity were examined for possible new connections between biological and biomedical concepts. For example, drugs and their unknown mechanisms of action, or two diseases with no prior knowledge about their similar molecular mechanisms. </p>
          <p style={{ marginTop: '20px' }}>
            This site is programatically accessible via a <Link href="/graphiql" className="underline cursor-pointer" target="_blank">GraphQL API</Link>.
          </p>
          <br />
          <p>
          RummagenexRummaGEO is actively being developed by <a className='underline cursor' href="https://labs.icahn.mssm.edu/maayanlab/">the Ma&apos;ayan Lab</a>
          </p>
          <br />
        
        </div>
       
      </div>
      
    </div>
  )
}
