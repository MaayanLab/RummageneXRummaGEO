// // 'use client'
// // import React from 'react'
// // import example from './example.json'
// // import uniqueArray from '@/utils/uniqueArray'
// // import { useAddUserGeneSetMutation } from '@/graphql'
// // import classNames from 'classnames'
// // import { useRouter } from 'next/navigation'



// // export default function InputForm() {
// //   const router = useRouter()
// //   const [rawGenes, setRawGenes] = React.useState('')
// //   const genes = React.useMemo(() => uniqueArray(rawGenes.split(/[;,\t\r\n\s]+/).filter(v => v)), [rawGenes])
// //   const [addUserGeneSetMutation, { loading, error }] = useAddUserGeneSetMutation()
// //   var fileReader = React.useRef<FileReader | null>(null);

// //   const handleFileRead = React.useCallback(() => {
// //       const content = fileReader!.current!.result as string;
// //       setRawGenes(content!);
// //   }, [setRawGenes])


// //   const handleFileChosen = React.useCallback((file: File | null) => {
// //       fileReader.current = new FileReader();
// //       fileReader.current.onloadend = handleFileRead;
// //       console.log(file)
// //       fileReader.current.readAsText(file!);
// //   }, [handleFileRead]);

// //   return (
// //     <>
// //       <h1 className="text-xl">Input gene set</h1>
// //       <p className="prose">
// //         Try a gene set <a
// //           className="font-bold cursor-pointer"
// //           onClick={() => {
// //             setRawGenes(example.genes.join('\n'))
// //           }}
// //         >example</a>.
// //       </p>
// //       <form
// //         className="flex flex-col place-items-end"
// //         onSubmit={async (evt) => {
// //           evt.preventDefault()
// //           const result = await addUserGeneSetMutation({
// //             variables: {
// //               genes,
// //             }
// //           })
// //           const id = result.data?.addUserGeneSet?.userGeneSet?.id
// //           if (id) {
// //             router.push(`/enrich?dataset=${id}`)
// //           }
// //         }}
// //       >
// //         <textarea
// //           value={rawGenes}
// //           onChange={evt => {
// //             setRawGenes(evt.currentTarget.value)
// //           }}
// //           rows={8}
// //           className="textarea textarea-bordered w-full"
// //           placeholder="Paste a set of valid Entrez gene symbols (e.g. STAT3) on each row in the text-box"
// //         />
// //         <input
// //             className="block w-full mb-5 text-xs text-gray-900 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
// //             id="fileUpload"
// //             type="file"
// //             onChange={(e) => {handleFileChosen(e.target.files?.[0] || null)}}/>
// //         {genes.length} gene(s) entered
// //         <button className="btn" type="submit">Submit</button>
// //         <span className={classNames("loading", "w-6", { 'hidden': !loading })}></span>
// //         <div className={classNames("alert alert-error", { 'hidden': !error })}>{error?.message ?? null}</div>
// //       </form>
// //     </>
// //   )
// // }


// // 'use client'
// // import React from 'react'
// // import example from './example.json'
// // import uniqueArray from '@/utils/uniqueArray'
// // import { useAddUserGeneSetMutation, useFetchUserGeneSetQuery } from '@/graphql'
// // import classNames from 'classnames'
// // import { useRouter } from 'next/navigation'

// // export default function InputForm() {
// //   const router = useRouter()
// //   const [rawGenes, setRawGenes] = React.useState('')
// //   const [isExample, setIsExample] = React.useState(false) // New flag to track if input is from example
// //   const genes = React.useMemo(() => uniqueArray(rawGenes.split(/[;,\t\r\n\s]+/).filter(v => v)), [rawGenes])
// //   const [addUserGeneSetMutation, { loading, error }] = useAddUserGeneSetMutation()
// //   var fileReader = React.useRef<FileReader | null>(null);

// //   const handleFileRead = React.useCallback(() => {
// //       const content = fileReader!.current!.result as string;
// //       setRawGenes(content!);
// //       setIsExample(false); // Reset the flag when a file is uploaded
// //   }, [setRawGenes])

// //   const handleFileChosen = React.useCallback((file: File | null) => {
// //       fileReader.current = new FileReader();
// //       fileReader.current.onloadend = handleFileRead;
// //       fileReader.current.readAsText(file!);
// //   }, [handleFileRead]);

// //   return (
// //     <>
// //       <h1 className="text-xl">Input gene set</h1>
// //       <p className="prose">
// //         Try a gene set <a
// //           className="font-bold cursor-pointer"
// //           onClick={() => {
// //             setRawGenes(example.genes.join('\n'))
// //             setIsExample(true) // Set the flag to true when using example data
// //           }}
// //         >example</a>.
// //       </p>
// //       <form
// //         className="flex flex-col place-items-end"
// //         onSubmit={async (evt) => {
// //           evt.preventDefault()
// //           // Prevent mutation if rawGenes is from the example
// //           if (isExample) {
// //             alert("Submission is disabled for the example gene set.");
// //             return;
// //           }

// //           const result = await addUserGeneSetMutation({
// //             variables: {
// //               genes,
// //             }
// //           })
// //           const id = result.data?.addUserGeneSet?.userGeneSet?.id
// //           if (id) {
// //             router.push(`/enrich?dataset=${id}`)
// //           }
// //         }}
// //       >
// //         <textarea
// //           value={rawGenes}
// //           onChange={evt => {
// //             setRawGenes(evt.currentTarget.value)
// //             setIsExample(false); // Reset the flag when the user manually enters data
// //           }}
// //           rows={8}
// //           className="textarea textarea-bordered w-full"
// //           placeholder="Paste a set of valid Entrez gene symbols (e.g. STAT3) on each row in the text-box"
// //         />
// //         <input
// //             className="block w-full mb-5 text-xs text-gray-900 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
// //             id="fileUpload"
// //             type="file"
// //             onChange={(e) => {handleFileChosen(e.target.files?.[0] || null)}}/>
// //         {genes.length} gene(s) entered
// //         <button className="btn" type="submit">Submit</button>
// //         <span className={classNames("loading", "w-6", { 'hidden': !loading })}></span>
// //         <div className={classNames("alert alert-error", { 'hidden': !error })}>{error?.message ?? null}</div>
// //       </form>
// //     </>
// //   )
// // }


// 'use client'
// import React from 'react'
// import example from './example.json'
// import uniqueArray from '@/utils/uniqueArray'
// import { useAddUserGeneSetMutation } from '@/graphql'
// import classNames from 'classnames'
// import { useRouter } from 'next/navigation'

// export default function InputForm() {
//   const router = useRouter()
//   const [rawGenes, setRawGenes] = React.useState('')
//   const genes = React.useMemo(() => uniqueArray(rawGenes.split(/[;,\t\r\n\s]+/).filter(v => v)), [rawGenes])
//   const [desc, setDesc] = React.useState('');
//   const description = React.useMemo(
//     () => `Description: ${desc} | Genes: ${genes.join(', ')}`,
//     [genes, desc]
//   )

//   const [addUserGeneSetMutation, { loading, error }] = useAddUserGeneSetMutation()
//   var fileReader = React.useRef<FileReader | null>(null);

//   const handleFileRead = React.useCallback(() => {
//       const content = fileReader!.current!.result as string;
//       setRawGenes(content!);
//   }, [setRawGenes])

//   const handleFileChosen = React.useCallback((file: File | null) => {
//       fileReader.current = new FileReader();
//       fileReader.current.onloadend = handleFileRead;
//       fileReader.current.readAsText(file!);
//   }, [handleFileRead]);

//   const handleSubmit = async (evt: React.FormEvent) => {
//     evt.preventDefault()

//     // Check if the entered genes match the example genes exactly
//     const isExample = genes.length === example.genes.length && genes.every((gene, i) => gene === example.genes[i])

//     let id = null

//     // If it's not the example, run the mutation
//     if (!isExample) {
//       const result = await addUserGeneSetMutation({
//         variables: {
//           genes,
//           description
       
//         }
//       })
//       id = result.data?.addUserGeneSet?.userGeneSet?.id
//     }

//     // Proceed to the next page, even if the mutation is skipped
//     if (id || isExample) {
//       router.push(`/enrich?dataset=${id || 'example'}`) // If skipping, use 'example' as dataset ID
//     }
//   }

//   return (
//     <>
//       <h1 className="text-xl">Input gene set</h1>
//       <p className="prose">
//         Try a gene set <a
//           className="font-bold cursor-pointer"
//           onClick={() => {
//             setRawGenes(example.genes.join('\n'))
//           }}
//         >example</a>.
//       </p>
//       <form
//         className="flex flex-col place-items-end"
//         onSubmit={handleSubmit}
//       >
//         <textarea
//           value={rawGenes}
//           onChange={evt => setRawGenes(evt.currentTarget.value)}
//           rows={8}
//           className="textarea textarea-bordered w-full"
//           placeholder="Paste a set of valid Entrez gene symbols (e.g. STAT3) on each row in the text-box"
//         />
//         <input
//             className="block w-full mb-5 text-xs text-gray-900 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
//             id="fileUpload"
//             type="file"
//             onChange={(e) => {handleFileChosen(e.target.files?.[0] || null)}}/>
//         {genes.length} gene(s) entered
//         <button className="btn" type="submit">Submit</button>
//         <span className={classNames("loading", "w-6", { 'hidden': !loading })}></span>
//         <div className={classNames("alert alert-error", { 'hidden': !error })}>{error?.message ?? null}</div>
//       </form>
//     </>
//   )
// }

'use client'
import React from 'react'
import example from './example.json'
import uniqueArray from '@/utils/uniqueArray'
import { useAddUserGeneSetMutation, useIncrementCounterMutation } from '@/graphql'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'

export default function InputForm() {
  const router = useRouter()
  const [rawGenes, setRawGenes] = React.useState('')
  const genes = React.useMemo(() => uniqueArray(rawGenes.split(/[;,\t\r\n\s]+/).filter(v => v)), [rawGenes])
  const [desc, setDesc] = React.useState('')


  const isExample = React.useMemo(() => {
    const sortedGenes = [...genes].sort();
    const sortedExampleGenes = [...example.genes].sort();
    return sortedGenes.length === sortedExampleGenes.length &&
           sortedGenes.every((gene, i) => gene === sortedExampleGenes[i]);
  }, [genes]);

  // const description = React.useMemo(
  //   () => `Description: ${desc} | Genes: ${genes.join(', ')}`,
  //   [genes, desc]
  // )
  const description = React.useMemo(() => desc, [desc]);

  const [addUserGeneSetMutation, { loading, error }] = useAddUserGeneSetMutation()
  const [incrementCounterMutation] = useIncrementCounterMutation()

  const fileReader = React.useRef<FileReader | null>(null)

  const handleFileRead = React.useCallback(() => {
      const content = fileReader.current?.result as string
      setRawGenes(content || '')
  }, [])

  const handleFileChosen = React.useCallback((file: File | null) => {
      fileReader.current = new FileReader()
      fileReader.current.onloadend = handleFileRead
      fileReader.current.readAsText(file || new Blob())
  }, [handleFileRead])

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault()

    let id = null

    if (!isExample) {
      const result = await addUserGeneSetMutation({
        variables: {
          genes,
          description
        }
      })
      id = result.data?.addUserGeneSet?.userGeneSet?.id
    }
    await incrementCounterMutation({})

    router.push(`/enrich?dataset=${id || 'example'}`)
  }

  return (
    <>
      <h1 className="text-xl">Input gene set</h1>
      <p className="prose">
        Try a gene set <a
          className="font-bold cursor-pointer"
          onClick={() => {
            setRawGenes(example.genes.join('\n'))
          }}
        >example</a>.
      </p>
      <form
        className="flex flex-col place-items-end"
        onSubmit={handleSubmit}
      >
        <textarea
          value={rawGenes}
          onChange={evt => setRawGenes(evt.currentTarget.value)}
          rows={8}
          className="textarea textarea-bordered w-full"
          placeholder="Paste a set of valid Entrez gene symbols (e.g., STAT3) on each row in the text-box"
        />
        <input
          className="block w-full mb-5 text-xs text-gray-900 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="fileUpload"
          type="file"
          onChange={(e) => { handleFileChosen(e.target.files?.[0] || null) }}
        />
        {genes.length} gene(s) entered

        {!isExample && genes.length > 0 && (
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            className="textarea textarea-bordered w-full mt-2"
            placeholder="Add a description for your gene set (optional)"
          />
        )}

        <button className="btn mt-3" type="submit">Submit</button>
        <span className={classNames("loading", "w-6", { 'hidden': !loading })}></span>
        <div className={classNames("alert alert-error", { 'hidden': !error })}>{error?.message ?? null}</div>
      </form>
    </>
  )
}