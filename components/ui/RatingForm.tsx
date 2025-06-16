'use client'

import clsx from 'clsx'
import { useState } from 'react'
import useUserId from '@/hooks/useUserId'

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
      setResult(`✅ Review submitted! Thank you for your feedback!`)
    } else {
      setResult(`❌ Error: ${data.error}`)
    }
  }

  const difficultyOptions: {
    label: string
    value: Difficulty
    color: string
    emoji: string
  }[] = [
    {
      value: 'easy',
      label: 'Easy',
      color: 'bg-green-500 hover:bg-green-600',
      emoji: '🟢',
    },
    {
      value: 'medium',
      label: 'Medium',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      emoji: '🟠',
    },
    {
      value: 'hard',
      label: 'Hard',
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
      <h2 className='text-2xl font-semibold'>How difficult was this puzzle?</h2>

      <div className='flex justify-center gap-4'>
        {difficultyOptions.map((opt) => (
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
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>

      <button
        type='submit'
        disabled={!selected}
        className={`px-6 py-3 rounded bg-blue-600 text-white font-semibold shadow-md transition
          hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
      >
        Submit Rating
      </button>

      <div>{result}</div>
    </form>
  )
}
