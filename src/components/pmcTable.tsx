import React from 'react'
import LinkedTerm from '@/components/linkedTerm';
import { useViewGeneSetQuery } from '@/graphql';
import GeneSetModal from '@/components/geneSetModal';
import useQsState from '@/utils/useQsState';
import Pagination from '@/components/pagination';
import blobTsv from '@/utils/blobTsv';
import clientDownloadBlob from '@/utils/clientDownloadBlob';
import Loading2 from './loading2';

const pageSize = 10

interface pmcData {
  __typename?: "PmcInfo" | undefined;
  pmc: string;
  title?: string | null | undefined;
  yr?: number | null | undefined;
  doi?: string | null | undefined;
}

export default function PmcTable({ terms, data, gene_set_ids }: { terms?: Map<string, string[]>, data?: pmcData[], gene_set_ids?: Map<string, string[]> }) {
  const [queryString, setQueryString] = useQsState({ page: '1', f: '' })
  const { page, searchTerm } = React.useMemo(() => ({ page: queryString.page ? +queryString.page : 1, searchTerm: queryString.f ?? '' }), [queryString])

  const dataFiltered = React.useMemo(() =>
    data?.filter(el => {
      const rowToSearch = el?.title + (terms?.get(el?.pmc)?.join(' ') || '')
      return (rowToSearch?.toLowerCase().includes(searchTerm.toLowerCase()))
    }),
  [data, terms, searchTerm])

  const [geneSetId, setGeneSetId] = React.useState<string | null>(gene_set_ids?.values().next().value?.at(0) || '')
  const [currTerm, setCurrTerm] = React.useState<string | null>(gene_set_ids?.keys().next().value?.at(0) || '')
  const [showModal, setShowModal] = React.useState(false)

  const genesQuery = useViewGeneSetQuery({
    variables: { id: geneSetId }
  })
  if (genesQuery.loading) {
    return <Loading2/>;
  }

  return (
    <>
      <GeneSetModal geneset={genesQuery?.data?.geneSet?.genes.nodes} term={currTerm} showModal={showModal} setShowModal={setShowModal}></GeneSetModal>
      <div className='border m-5 mt-1'>
        <div className='join flex flex-row place-content-end items-center pt-3 pr-3'>
          <span className="label-text text-base">Search:&nbsp;</span>
          <input
            type="text"
            className="input input-bordered"
            value={searchTerm}
            onChange={evt => {
              setQueryString({ page: '1', f: evt.currentTarget.value })
            }}
          />
          <div className="tooltip" data-tip="Search results">
            <button
              type="submit"
              className="btn join-item"
            >&#x1F50D;</button>
          </div>
          <div className="tooltip" data-tip="Clear search">
            <button
              type="reset"
              className="btn join-item"
              onClick={evt => {
                setQueryString({ page: '1', f: '' })
              }}
            >&#x232B;</button>
          </div>
          <div className="tooltip" data-tip="Download results">
            <button
              type="button"
              className="btn join-item font-bold text-2xl pb-1"
              onClick={evt => {
                if (!dataFiltered) return
                const blob = blobTsv(['pmc', 'title', 'year', 'doi', 'terms'], dataFiltered, item => ({
                  pmc: item.pmc,
                  title: item.title,
                  year: item.yr,
                  doi: item.doi,
                  terms: terms?.get(item.pmc)?.join(' ')
                }))
                clientDownloadBlob(blob, 'results.tsv')
              }}
            >&#x21E9;</button>
          </div>
        </div>
        <table className="table table-xs table-pin-rows table-pin-cols table-auto">
          <thead>
            <tr>
              <th>PMC</th>
              <th>Title</th>
              <th className="w-20">Year</th>
              <th># Terms</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataFiltered?.slice((page-1) * pageSize, page * pageSize).map(el => {
              return (
                <>
                  <tr key={el?.pmc} className={"hover:bg-gray-100 dark:hover:bg-gray-700"}>
                    <td><LinkedTerm term={`${el?.pmc} `}></LinkedTerm></td>
                    <td>{el?.title}</td>
                    <td>{el?.yr}</td>
                    <td>{terms?.get(el?.pmc)?.length}</td>
                    <td className='align-text-middle'>
                      <button
                      onClick={evt => {
                        terms?.get(el?.pmc)?.map(term => document.getElementById(term)?.classList.toggle('hidden'))
                      }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  {terms?.get(el?.pmc)?.map(term => {
                    return (
                      <tr key={term} id={term} className='hidden'>
                        <td colSpan={2}>{term}</td>
                        <td colSpan={4}>
                          <button
                            className='btn btn-xs btn-outline p-2 h-auto'
                            data-te-toggle="modal"
                            data-te-target="#geneSetModal"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={evt => {
                              setCurrTerm(term)
                              setGeneSetId(gene_set_ids?.get(term)?.at(0) || '')
                              setShowModal(true)
                            }}
                          ><p>View Gene Set ({gene_set_ids?.get(term)?.at(1) || 'n'})</p>
                          </button>
                        </td>
                      </tr>)
                  })}
                </>
              )
            })}
          </tbody >
        </table>
      </div>
      <div className="flex flex-col items-center">
        <Pagination
          page={page}
          pageSize={pageSize}
          totalCount={dataFiltered?.length}
          onChange={newPage => {setQueryString({ page: `${newPage}` })}}
        />
      </div>
    </>
  )
}