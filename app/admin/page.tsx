'use client'

import { useState } from 'react'

export default function PuzzleManager() {
  // State for adding a puzzle
  const [nameEN, setNameEN] = useState('')
  const [nameLT, setNameLT] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // State for removing a puzzle
  const [removeImageId, setRemoveImageId] = useState('')

  const [result, setResult] = useState<string | null>(null)

  // Handle adding a puzzle
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('./api/add-puzzle', {
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

  // Handle removing a puzzle
  const handleRemoveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('./api/remove-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: removeImageId }),
    })

    const data = await res.json()
    if (res.ok) {
      setResult(`✅ Puzzle removed successfully`)
      setRemoveImageId('')
    } else {
      setResult(`❌ Error: ${data.error}`)
    }
  }

  return (
    <div>
      <div>
        <h1>Add a New Puzzle</h1>
        <form onSubmit={handleAddSubmit}>
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
      </div>
      <div>
        <h1>Remove a Puzzle</h1>
        <form onSubmit={handleRemoveSubmit}>
          <input
            value={removeImageId}
            onChange={(e) => setRemoveImageId(e.target.value)}
            placeholder='Puzzle id'
            required
          />
          <button type='submit'>Remove Puzzle</button>
        </form>
      </div>
      {result && <p>{result}</p>}
    </div>
  )
}
