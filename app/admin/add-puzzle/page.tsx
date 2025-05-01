'use client'

import { useState } from 'react'

export default function AddPuzzle() {
  const [nameEN, setNameEN] = useState('')
  const [nameLT, setNameLT] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('../api/add-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nameEN, nameLT, imageUrl }),
    })

    const data = await res.json()
    if (res.ok) {
      setResult(`✅ Puzzle added with ID: ${data.id}`)
      setNameEN('')
      setNameLT('')
      setImageUrl('')
    } else {
      setResult(`❌ Error: ${data.error}`)
    }
  }

  return (
    <div>
      <h1>Add a New Puzzle</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={nameEN}
          onChange={(e) => setNameEN(e.target.value)}
          placeholder='Puzzle Name'
          required
        />
        <input
          value={nameLT}
          onChange={(e) => setNameLT(e.target.value)}
          placeholder='Pavadinimas lietuviškai'
          required
        />
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder='Image url (in */puzzles/)'
          required
        />
        <button type='submit'>Add Puzzle</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  )
}
