import Image from 'next/image'
import React from 'react'
import Stats from './stats'


export default function HomeLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col lg:flex-row items-center justify-center">
        <div className="card max-w-xs shadow-2xl bg-base-100 flex-shrink-0">
          <div className="card-body">
            {children}
          </div>
        </div>
        <div className="text-center p-10">
          <h2 className="text-2xl font-bold p-2">
            RummagenexRummaGEO
          </h2>
          <div className='inline-flex'>
            <Image className={'rounded'} src={'/images/rummagenexrummageo_logo.png'} width={225} height={225} alt={'RummagenexRummaGEO'}></Image>
          </div>
          <React.Suspense fallback={<div className="text-center p-5"><Image className={'rounded mx-auto'} src={'/images/loading.gif'} width={125} height={250} alt={'Loading...'}/> </div>}>
          <h1 className="text-2xl font-bold">
            <span className="whitespace-nowrap">Rummage through the top <Stats bold show_unique_term/> </span>
          </h1>
          <div>
            <span className="whitespace-nowrap"> by p value and odds ratio from crossing the gene sets from Rummagene and RummaGEO. Gene set pairs are sorted by the level of overlap </span>
            <h1>
            <span className="whitespace-nowrap"> computed with the Fisher's exact test. To create the RummagenexRummaGEO database,  </span>
          </h1>
          <span className="whitespace-nowrap"> we crossed 748,220 Rummagene sets with 170,612 human RummaGEO sets and 193,939 mouse RummaGEO sets</span>
                  <p> to find the most similar gene sets that match your query.</p>

          </div>
          <div className="mt-5">
            <span className="whitespace-nowrap">We used supporting materials from 121,237 PMC articles</span>
            <div><span className="whitespace-nowrap">scanned by Rummagene and crossed them with gene sets from</span></div>
            <div><span className="whitespace-nowrap"> 13,637 human GEO studies and 15,887 mouse GEO studies extracted by RummaGEO.</span></div>
            
          </div>
          </React.Suspense>
        </div>
      </div>
    </div>
  )
}