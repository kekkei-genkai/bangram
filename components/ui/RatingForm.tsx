'use client'

import clsx from 'clsx'
import { useState } from 'react'
import useUserId from '@/hooks/useUserId'
import { useLanguage } from '@/context/LanguageContext'

type Difficulty = 'easy' | 'medium' | 'hard'

interface RatingFormProps extends React.HTMLAttributes<HTMLFormElement> {
  puzzleId: string
  className?: string
}

export default function RatingForm({
  puzzleId,
  className,
  ...rest
}: RatingFormProps) {
  const { lang } = useLanguage()

  const text = {
    title:
      lang == 'en'
        ? 'How difficult was the puzzle?'
        : 'Įvertinkite dėlionės sudėtingumą',
    submit: lang == 'en' ? 'Submit Rating' : 'Pateikti įvertinimą',
    easy: lang == 'en' ? 'Easy' : 'Lengva',
    medium: lang == 'en' ? 'Medium' : 'Vidutinė',
    hard: lang == 'en' ? 'Hard' : 'Sunki',
    success:
      lang == 'en'
        ? 'Review submitted! Thank you for your feedback!'
        : 'Ačiū už atsiliepimą!',
  }

  const userId = useUserId()

  const [selected, setSelected] = useState<Difficulty | null>(null)

  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selected) return

    const res = await fetch('../api/add-rating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ puzzleId, userId, difficulty: selected }),
    })

    const data = await res.json()
    if (res.ok) {
      setResult(`✅ ${text.success}`)
    } else {
      setResult(`❌ Error: ${data.error}`)
    }
  }

  const colors: {
    value: Difficulty
    color: string
    emoji: string
  }[] = [
    {
      value: 'easy',
      color: 'bg-green-500 hover:bg-green-600',
      emoji: '🟢',
    },
    {
      value: 'medium',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      emoji: '🟠',
    },
    {
      value: 'hard',
      color: 'bg-red-500 hover:bg-red-600',
      emoji: '🔴',
    },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('text-center space-y-6', className)}
      {...rest}
    >
      <h2 className='text-2xl font-semibold'>{text.title}</h2>

      <div className='flex justify-center gap-4'>
        {colors.map((opt) => (
          <button
            key={opt.value}
            type='button'
            onClick={() => {
              setSelected(selected == opt.value ? null : opt.value)
            }}
            className={`px-5 py-3 rounded text-white font-medium transition-colors duration-200
              ${opt.color}`}
            style={{
              transition: 'transform 200ms',
              transform: selected == opt.value ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {opt.emoji} {text[opt.value]}
          </button>
        ))}
      </div>

      <button
        type='submit'
        disabled={!selected}
        className={`px-6 py-3 rounded bg-blue-600 text-white font-semibold shadow-md transition
          hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        {text.submit}
      </button>

      <div>{result}</div>
    </form>
  )
}
