import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-full'>

        <div className='animate-spin border-4 border-t-transparent w-[5vmax] h-[5vmax] rounded-full border-red-800'></div>

    </div>
  )
}

export default Loading