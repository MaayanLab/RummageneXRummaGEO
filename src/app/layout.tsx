import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import Link from "next/link"
import { ApolloWrapper } from '@/lib/apollo/provider'
import Nav from './nav'
import Stats from './stats'
import Image from 'next/image'
import { RuntimeConfig } from '@/app/runtimeConfig'
import Analytics from '@/app/analytics'

export const metadata: Metadata = {
  title: 'RummagenexRummaGEO',
  description: 'Find gene sets from crossing Rummagene with RummaGEO',
  keywords: [
    // Keywords here...
  ].join(', '),
  metadataBase: new URL('https://rummagenexrummageo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RummagenexRummaGEO',
    description: 'Find gene sets from crossing Rummagene with RummaGEO',
    url: 'https://rummagenexrummageo.com',
    siteName: 'RummagenexRummaGEO',
    images: [{
      url: 'https://rummagenexrummageo.com/images/rummagenexrummageo_logo.png',
      width: 640,
      height: 671,
    }],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function RootLayout({
  children,
  jsonld,
}: {
  children: React.ReactNode,
  jsonld?: React.ReactNode,
}) {
  return (
    <html lang="en" style={{ minWidth: '580px' }}>
      <head>
        {jsonld}
      </head>
      <ApolloWrapper>
        <RuntimeConfig>
          <body className="min-h-screen flex flex-col">
            <header>
              <div className="navbar block text-center">
                <div className="navbar-center">
                  <ul className="menu menu-horizontal gap-3 text-lg justify-center">
                    <Nav />
                  </ul>
                </div>
                <div className="navbar-center ml-5">
                  <React.Suspense fallback={<span className="loading loading-ring loading-lg"></span>}>
                    <Stats bold show_sets_analyzed />
                  </React.Suspense>
                </div>
              </div>
            </header>
            <main className="flex-1 flex flex-col justify-stretch mx-8 md:mx-32">
              <React.Suspense fallback={<span className="loading loading-ring loading-lg"></span>}>
                {children}
              </React.Suspense>
            </main>
            <footer className="flex-none footer p-5 mt-5 bg-neutral text-neutral-content flex place-content-evenly">
              <div className="text-center pt-5">
                <ul>
                  {/* <li><Link href="mailto:avi.maayan@mssm.edu" target="_blank">Contact Us</Link></li> */}
                  <li>
                    {/* <Link href="https://github.com/MaayanLab/rummagenexrummageo" target="_blank" rel="noopener noreferrer">
                      Source Code
                    </Link> */}
                  </li>
                </ul>
              </div>
              <div className="text-center">
              <p>
                  <Link href="https://labs.icahn.mssm.edu/" target="_blank" rel="noopener noreferrer">
                    <Image src={'/images/ismms_white.png'} width={150} height={250} alt={'Ma&apos;ayan Lab'}/>
                  </Link>
                </p>
              </div>
              <div className="text-center pt-5">
              <p>
                <Link href="https://labs.icahn.mssm.edu/maayanlab/" target="_blank" rel="noopener noreferrer">
                  <Image className={'rounded'} src={'/images/maayanlab_white.png'} width={125} height={250} alt={'Ma&apos;ayan Lab'}/>
                </Link>
                </p>
              </div>
            </footer>
          </body>
          <Analytics />
        </RuntimeConfig>
      </ApolloWrapper>
    </html>
  )
}
