import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <div>Sigma</div>
      <div>
        <Link href='/about'>Go to About Page</Link>
      </div>
      <div>
        <Link href='/gallery'>Go to Gallery</Link>
      </div>
    </div>
  )
}
