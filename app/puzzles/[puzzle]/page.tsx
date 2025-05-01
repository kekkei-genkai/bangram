'use client'

import './style.css'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import PixelImage from '@/components/ui/PixelImage'
import { useLanguage } from '@/context/LanguageContext'

type Puzzle = {
  id: string
  name_en: string
  name_lt: string
  image_url: string
}

export default function Page() {
  const { lang } = useLanguage()

  const text = {
    copy: lang == 'en' ? 'Copy link' : 'Kopijuoti nuorodą',
    copied: lang == 'en' ? 'Copied ✓' : 'Nukopijuota ✓',
  }

  const params = useParams()
  const puzzleID = params.puzzle

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      console.log(puzzleID)
      const res = await fetch('../api/get-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: puzzleID }),
      })

      const data = await res.json()
      if (res.ok) {
        setPuzzle(data.puzzle)
      } else {
        setErrorMessage(`❌ Error: ${data.error}`)
      }
    }

    fetchData()
  }, [puzzleID])

  return (
    <div>
      <div>{errorMessage}</div>
      {puzzle && (
        <div className='container'>
          <PixelImage
            src={`/puzzles/${puzzle.image_url}`}
            targetSize={256}
            scale={8}
            className='puzzle-image'
          />

          <b className='text'>
            {lang == 'en' ? puzzle.name_en : puzzle.name_lt}
          </b>
          <i
            className='text cursor-pointer'
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              const target = event.currentTarget
              const originalText = target.innerText
              const fullUrl = window.location.origin + window.location.pathname
              navigator.clipboard.writeText(fullUrl)
              target.innerText = text.copied
              setTimeout(() => {
                target.innerText = originalText
              }, 1500)
            }}
          >
            {text.copy}
          </i>
        </div>
      )}
    </div>
  )
}
