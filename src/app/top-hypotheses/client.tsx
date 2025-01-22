'use client'
import React from 'react'
import {
  useViewGeneSetQuery,
} from '@/graphql'
import GeneSetModal from '@/components/geneSetModal'
import HypothesisResults from './hyp'
import HypothesisModal from '@/components/hypothesisModal'
import { UUID } from 'crypto'
import SamplesModal from '@/components/samplesModal'

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


type GeneSetModalT =  {
  type: 'GeneSet',
  id: string,
  description: string,
  genes: string[],
} | {
  type: 'GeneSetHypothesis',
  id: UUID,
  genes: string[]
  rummagene: string,
  rummageo: string,

} | undefined



function HypothesisModalWrapper(props: {
  modalGeneSet: GeneSetModalT;
  setModalGeneSet: React.Dispatch<React.SetStateAction<GeneSetModalT>>;
}) {
  

  if (props.modalGeneSet?.type === "GeneSetHypothesis") {
    return (
      <HypothesisModal
        showModal={true}
        genes={props.modalGeneSet.genes}
        geneset={props.modalGeneSet.genes}
        rummagene={props.modalGeneSet.rummagene}
        rummageo={props.modalGeneSet.rummageo}
        set_id={props.modalGeneSet.id}
        setShowModal={(show) => {
          if (!show) props.setModalGeneSet(undefined);
        }}
      />
    );
  }

  return null;
}


function GeneSetModalWrapper(props: { modalGeneSet: GeneSetModalT, setModalGeneSet: React.Dispatch<React.SetStateAction<GeneSetModalT>> }) {

  const { data: geneSet } = useViewGeneSetQuery({
    skip: props.modalGeneSet?.type !== 'GeneSet',
    variables: props.modalGeneSet?.type === 'GeneSet' ? {
      id: props.modalGeneSet.id,
    } : undefined
  })

  

  return (
    <GeneSetModal
      showModal={props.modalGeneSet !== undefined}
      term={ props.modalGeneSet?.type === 'GeneSet' ? props.modalGeneSet?.description : undefined}
      geneset={
        props.modalGeneSet?.type === 'GeneSet' ? geneSet?.geneSet?.genes.nodes
        : undefined
      }
      setShowModal={show => {
        if (!show) props.setModalGeneSet(undefined)
      }}
    />
  )
}

export default function HypClientPage() {
  const [modalGeneSet, setModalGeneSet] = React.useState<GeneSetModalT>()
  const [modalHypothesis, setModalHypothesis] = React.useState<GeneSetModalT>();
  const [modalSamples, setModalSamples] = React.useState<string[]>();
  const [modalCondition, setModalCondition] = React.useState<string>();
  return (
    <>
      <HypothesisResults setModalGeneSet={setModalGeneSet}  setModalHypothesis={setModalHypothesis} setModalCondition={setModalCondition} setModalSamples={setModalSamples}/>

      <HypothesisModalWrapper
        modalGeneSet={modalHypothesis}
        setModalGeneSet={setModalHypothesis}/>   
            <GeneSetModalWrapper modalGeneSet={modalGeneSet} setModalGeneSet={setModalGeneSet} />
            <SamplesModalWrapper
        samples={modalSamples ?? []}
        condition={modalCondition ?? ""}
        setModalSamples={setModalSamples}
      />
    </>
  )
}