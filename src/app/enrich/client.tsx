'use client'
import React from 'react'
import {
  useFetchGeneInfoQuery,
  useFetchUserGeneSetQuery,
  useOverlapQueryQuery,
  useViewGeneSetQuery
} from '@/graphql'
import ensureArray from "@/utils/ensureArray"
import GeneSetModal from '@/components/geneSetModal'
import EnrichmentResults from './EnrichmentResults'
import SamplesModal from '@/components/samplesModal'
import example from '../example.json'


type GeneSetModalT = {
  type: 'UserGeneSet',
  description: string,
  genes: string[],
} | {
  type: 'GeneSetOverlap',
  id: string,
  description: string,
  genes: string[]
} | {
  type: 'GeneSet',
  id: string,
  description: string,
} | {
  type: 'GeneSetOverlap2',
  id: string,
  genes: string[]
  gseTitle: string,
  gseSummary: string,
  pmcSummary: string,
  pmcTitle: string,
  species: string,
  cond1Title: string,
  cond2Title: string,
  rummagene: string,
  rummageo: string,
  description: string,
  table_name: string,

} | undefined


function SamplesModalWrapper(props: {
  samples: string[];
  condition: string;
  setModalSamples: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}) {
  return (
    <SamplesModal
      samples={props.samples}
      showModal={props.samples.length != 0 && props.condition !== ""}
      condition={props.condition}
      setShowModal={(show) => {
        if (!show) props.setModalSamples([]);
      }}
    />
  );
}


function GeneSetModalWrapper(props: { modalGeneSet: GeneSetModalT, setModalGeneSet: React.Dispatch<React.SetStateAction<GeneSetModalT>> }) {
  const { data: geneSet } = useViewGeneSetQuery({
    skip: props.modalGeneSet?.type !== 'GeneSet',
    variables: props.modalGeneSet?.type === 'GeneSet' ? {
      id: props.modalGeneSet.id,
    } : undefined
  })
  const { data: overlap } = useOverlapQueryQuery({
    skip: props.modalGeneSet?.type !== 'GeneSetOverlap',
    variables: props.modalGeneSet?.type === 'GeneSetOverlap' ?  {
      id: props.modalGeneSet.id,
      genes: props.modalGeneSet?.genes,
    } : undefined,
  })
  const { data: userGeneSet } = useFetchGeneInfoQuery({
    skip: props.modalGeneSet?.type !== 'UserGeneSet',
    variables: props.modalGeneSet?.type === 'UserGeneSet' ? {
      genes: props.modalGeneSet.genes,
    } : undefined,
  })
  return (
    <GeneSetModal
      showModal={props.modalGeneSet !== undefined}
      term={props.modalGeneSet?.description}
      geneset={
        props.modalGeneSet?.type === 'GeneSet' ? geneSet?.geneSet?.genes.nodes
        : props.modalGeneSet?.type === 'GeneSetOverlap' ? overlap?.geneSet?.overlap.nodes
        : props.modalGeneSet?.type === 'UserGeneSet' ?
        userGeneSet?.geneMap2?.nodes ? userGeneSet.geneMap2.nodes.map(({ gene, geneInfo }) => ({gene, ...geneInfo}))
        : props.modalGeneSet.genes.map(symbol => ({ symbol }))
      : undefined
      }
      setShowModal={show => {
        if (!show) props.setModalGeneSet(undefined)
      }}
    />
  )
}

export default function EnrichClientPage({
  searchParams
}: {
  searchParams: {
    dataset: string | string[] | undefined
  },
}) {
  const dataset = ensureArray(searchParams.dataset)[0]
  const shouldSkipFetch = dataset === "example"
  const userGeneSet = shouldSkipFetch ? {
    userGeneSet: {
      genes: example.genes, // Assuming 'genes' exists in example.json
      description: "Example Gene Set",
    }
  } : useFetchUserGeneSetQuery({
    skip: shouldSkipFetch || !dataset,
    variables: { id: dataset },
  }).data
  
  const [modalGeneSet, setModalGeneSet] = React.useState<GeneSetModalT>()
  const [modalSamples, setModalSamples] = React.useState<string[]>();
  const [modalCondition, setModalCondition] = React.useState<string>();

  return (
    <>
      <div className="flex flex-row gap-2 alert">
        <span className="prose">Input:</span>
        <label
          htmlFor="geneSetModal"
          className="prose underline cursor-pointer"
          onClick={evt => {
            setModalGeneSet({
              type: 'UserGeneSet',
              genes: (userGeneSet?.userGeneSet?.genes ?? []).filter((gene): gene is string => !!gene),
              description: userGeneSet?.userGeneSet?.description || 'Gene set',
            })
          }}
        >{userGeneSet?.userGeneSet?.description || 'Gene set'}{userGeneSet ? <> ({userGeneSet?.userGeneSet?.genes?.length ?? '?'} genes)</> : null}</label>
      </div>
      <EnrichmentResults userGeneSet={userGeneSet} setModalGeneSet={setModalGeneSet} setModalCondition={setModalCondition} setModalSamples={setModalSamples}/>
      <GeneSetModalWrapper modalGeneSet={modalGeneSet} setModalGeneSet={setModalGeneSet} />  
      <SamplesModalWrapper
        samples={modalSamples ?? []}
        condition={modalCondition ?? ""}
        setModalSamples={setModalSamples}
      />
       </>
  )
}