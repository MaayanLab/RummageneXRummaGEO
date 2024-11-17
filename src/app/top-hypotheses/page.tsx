

import React from 'react'
import { Metadata} from 'next'
import HypClientPage from './client'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Top 1000 Hypotheses',
    description: '', 
    keywords: '',
  };
}

export default function HypPage() {
  return <HypClientPage />
}
