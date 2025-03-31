'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Page() {
  const params = useParams()
  const img = params.img

  return (
    <div>
      <h1>Image: {img}</h1>
      <Link href='/gallery/'>Back to Gallery</Link>
    </div>
  )
}
