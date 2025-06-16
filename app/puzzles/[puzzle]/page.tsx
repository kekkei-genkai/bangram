'use client'

import './style.css'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

import dynamic from 'next/dynamic'

const InteractivePuzzle = dynamic(
  () => import('@/components/ui/InteractivePuzzle'),
  {
    ssr: false, // 👈 forces this to be client-only
  },
)

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
  /*
  useEffect(() => {
    const fetchData = async () => {
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
*/
  return (
    <div>
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
        <h2
          className='cursor-pointer'
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            const target = event.currentTarget
            const originalText = target.textContent
            const fullUrl = window.location.origin + window.location.pathname

            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard
                .writeText(fullUrl)
                .then(() => {
                  target.textContent = text.copied
                  setTimeout(() => {
                    target.textContent = originalText
                  }, 1500)
                })
                .catch(() => {
                  copyUsingInput(fullUrl, target, originalText)
                })
            } else {
              copyUsingInput(fullUrl, target, originalText)
            }

            function copyUsingInput(
              textToCopy: string,
              target: HTMLElement,
              originalText: string | null,
            ) {
              const input = document.createElement('input')
              input.style.position = 'absolute'
              input.style.left = '-9999px'
              input.value = textToCopy
              document.body.appendChild(input)
              input.select()
              input.setSelectionRange(0, input.value.length)
              // Execute the copy command synchronously
              const successful = document.execCommand('copy')
              document.body.removeChild(input)
              if (successful) {
                target.textContent = text.copied
                setTimeout(() => {
                  target.textContent = originalText
                }, 1500)
              }
            }
          }}
        >
          {text.copy}
        </h2>
      </div>
    </div>
  )
}
