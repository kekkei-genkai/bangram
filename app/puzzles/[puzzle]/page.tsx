'use client'

import './style.css'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import CopyableHeading from '@/components/ui/CopyableHeading'
import InteractivePuzzle from '@/components/ui/InteractivePuzzle'
import RatingForm from '@/components/ui/RatingForm'

type Puzzle = {
  id: string
  name_en: string
  name_lt: string
  difficulty?: string
  user_difficulty?: string
  image_url: string
}

export default function Page() {
  const { lang } = useLanguage()

  const text = {
    copy: lang == 'en' ? 'Copy link' : 'Kopijuoti nuorodą',
    copied: lang == 'en' ? 'Copied ✓' : 'Nukopijuota ✓',
  }

  const params = useParams()
  const puzzleId = params.puzzle as string

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('../api/get-puzzle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: puzzleId }),
      })

      const data = await res.json()
      if (res.ok) {
        setPuzzle(data.puzzle)
      } else {
        setErrorMessage(`❌ Error: ${data.error}`)
      }
    }

    fetchData()
  }, [puzzleId])

  return (
    <div>
      {/* error message */}
      <div>{errorMessage}</div>
      {/* puzzle container */}
      {puzzle && (
        <div className='page-container'>
          {/* name */}
          {puzzle && (
            <h1 className='text-2xl font-bold'>
              {lang == 'en' ? puzzle.name_en : puzzle.name_lt}
            </h1>
          )}
          {/* puzzle */}
          <InteractivePuzzle
            viewBox='0 0 640 480'
            className='interactive-puzzle'
          ></InteractivePuzzle>
          {/* link */}
          <CopyableHeading
            text={{ copy: text.copy, copied: text.copied }}
            copyValue={window.location.origin + window.location.pathname}
            resetDelayMs={3000}
          />
          {/* rating form */}
          <RatingForm puzzleId={puzzleId} className='rating-form' />
        </div>
      )}
    </div>
  )
}
