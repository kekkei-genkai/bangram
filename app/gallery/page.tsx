'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <div
      className='grid gap-2 p-4'
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
      }}
    >
      {Array.from({ length: 100 }).map((_, index) => (
        <Link
          href={`/gallery/${index + 1}`}
          key={index}
          className='flex items-center justify-center h-16 bg-blue-500 text-white font-bold rounded-lg shadow-md transition duration-300 hover:bg-blue-700'
        >
          {index + 1}
        </Link>
      ))}
    </div>
  )
}
