
// import React from 'react'
// import Image from 'next/image'

// export default function Loading() {
//   return (
//     <>
//         <div className="text-center p-5">
//         <Image className={'rounded mx-auto'} src={'/images/loading.gif'} width={125} height={250} alt={'Loading...'}/> 
//         <p>Loading...</p>
//         </div>
//     </> 
//   )
// }

// export default function Loading2() {
//   return (
//     <>
//         <div className="text-center p-5">
//         <Image className={'rounded mx-auto'} src={'/images/loading.gif'} width={125} height={150} alt={'Loading...'}/> 
//         <p>Loading...</p>
//         </div>
//     </> 
//   )
// }

import React from 'react';
import Image from 'next/image';

const Loading2 = ({ width = 125, height = 150 }) => {
  return (
    <div className="text-center p-5">
      <Image
        className="rounded mx-auto"
        src="/images/loading.gif"
        width={width}
        height={height}
        alt="Loading..."
      />
      <p>Loading...</p>
    </div>
  );
};

export default Loading2;



