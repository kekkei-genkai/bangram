/* eslint-disable @next/next/no-img-element */
'use client'

import { useLanguage } from '@/context/LanguageContext'
import PixelImage from '@/components/ui/PixelImage'
import './style.css'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Puzzle = {
  id: string
  name_en: string
  name_lt: string
  difficulty?: string
  image_url: string
}

type Difficulty = 'easy' | 'medium' | 'hard'

export default function Page() {
  const { lang } = useLanguage()

  const [puzzles, setPuzzles] = useState<Puzzle[] | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('../api/get-puzzles', {
        method: 'GET',
      })

      const data = await res.json()
      if (res.ok && data.error == null) {
        setPuzzles(data.puzzles)
      } else {
        setErrorMessage(`❌ Error: ${data.error}`)
      }
    }

    fetchData()
  }, [])

  const difficultyOptions: Record<
    Difficulty,
    { labelEN: string; labelLT: string; color: string; emoji: string }
  > = {
    easy: {
      labelEN: 'Easy',
      labelLT: 'Lengva',
      color: 'bg-green-500',
      emoji: '🟢',
    },
    medium: {
      labelEN: 'Medium',
      labelLT: 'Vidutinė',
      color: 'bg-yellow-500',
      emoji: '🟠',
    },
    hard: {
      labelEN: 'Hard',
      labelLT: 'Sunki',
      color: 'bg-red-500',
      emoji: '🔴',
    },
  }

  return (
    <div>
      <div>{errorMessage}</div>
      <div className='puzzle-container'>
        {puzzles &&
          puzzles.map((puzzle) => (
            <Link
              key={puzzle.id}
              href={`/puzzles/${puzzle.id}`}
              className='puzzle-card'
            >
              {puzzle.difficulty && (
                <div
                  className={`px-4 py-2 rounded text-white font-medium ml-auto
              ${difficultyOptions[puzzle.difficulty as Difficulty].color}`}
                >
                  {difficultyOptions[puzzle.difficulty as Difficulty].emoji}{' '}
                  {lang == 'en'
                    ? difficultyOptions[puzzle.difficulty as Difficulty].labelEN
                    : difficultyOptions[puzzle.difficulty as Difficulty]
                        .labelLT}
                </div>
              )}
              <PixelImage
                src={`/puzzles/${puzzle.image_url}`}
                targetSize={256}
                scale={8}
                className='puzzle-image'
              />
              <b className='puzzle-text'>
                {lang == 'en' ? puzzle.name_en : puzzle.name_lt}
              </b>
            </Link>
          ))}
      </div>
    </div>
  )
}
