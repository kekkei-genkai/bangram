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
            threshold={puzzle.name_en == 'Ugnius' ? 24 : -1}
            className='puzzle-image'
          />

          <h1 className='text-2xl font-bold'>
            {lang == 'en' ? puzzle.name_en : puzzle.name_lt}
          </h1>
          <h2
            className='cursor-pointer'
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
          </h2>
          <form
            className='flex flex-col items-center mt-4'
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const difficulty = formData.get('difficulty')
              if (difficulty) {
              }
            }}
          >
            <div className='flex gap-4 mb-4'>
              <label className='flex items-center gap-2'>
                <input type='radio' name='difficulty' value='Easy' />
                <span>Easy</span>
              </label>
              <label className='flex items-center gap-2'>
                <input type='radio' name='difficulty' value='Medium' />
                <span>Medium</span>
              </label>
              <label className='flex items-center gap-2'>
                <input type='radio' name='difficulty' value='Hard' />
                <span>Hard</span>
              </label>
            </div>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded'
              style={{ width: 'fit-content' }}
            >
              Confirm Rating
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
