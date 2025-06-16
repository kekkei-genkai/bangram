'use client'

import { useState } from 'react'

export default function PuzzleManager() {
  // States for adding a puzzle
  const [nameEN, setNameEN] = useState('')
  const [nameLT, setNameLT] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [difficulty, setDifficulty] = useState('')

  // States for editing a puzzle
  const [puzzleId, setPuzzleId] = useState('')
  const [puzzleName, setPuzzleName] = useState('')

  const [loadedPuzzleId, setLoadedPuzzleId] = useState('')
  const [loadedPuzzle, setLoadedPuzzle] = useState(false)
  const [loadedNameEN, setLoadedNameEN] = useState('')
  const [loadedNameLT, setLoadedNameLT] = useState('')
  const [loadedImageUrl, setLoadedImageUrl] = useState('')
  const [loadedDifficulty, setLoadedDifficulty] = useState('')

  const [result, setResult] = useState<string | null>(null)

  // Handle adding a puzzle
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('./api/add-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nameEN, nameLT, difficulty, imageUrl }),
    })

    const data = await res.json()
    if (res.ok) {
      setResult(`✅ Puzzle added with ID: ${data.id}`)
      setNameEN('')
      setNameLT('')
      setImageUrl('')
      setDifficulty('')
    } else {
      setResult(`❌ Error: ${data.error}`)
    }
  }

  // Handle getting a puzzle
  const handleGetSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('./api/get-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: puzzleId, nameEN: puzzleName }),
    })

    const data = await res.json()
    if (res.ok) {
      setLoadedPuzzle(true)
      setLoadedPuzzleId(data.puzzle.id)
      setLoadedNameEN(data.puzzle.name_en)
      setLoadedNameLT(data.puzzle.name_lt)
      setLoadedImageUrl(data.puzzle.image_url)
      setLoadedDifficulty(data.puzzle.difficulty || '')

      setResult(null)
    } else {
      setResult(`❌ Error: ${data.error}`)
    }
  }

  const handleLoadedSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nativeEvent = e.nativeEvent as SubmitEvent
    const submitter = nativeEvent.submitter as HTMLButtonElement
    const action = submitter?.value
    let confirmation = false

    if (action == 'update') {
      confirmation = await handleUpdate(e)
    } else if (action == 'remove') {
      confirmation = await handleRemove(e)
    }

    if (confirmation) {
      setLoadedPuzzle(false)
      setPuzzleId('')
      setPuzzleName('')
    }
  }

  // Handle loadeding a puzzle
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('./api/update-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: loadedPuzzleId,
        nameEN: loadedNameEN,
        nameLT: loadedNameLT,
        difficulty: loadedDifficulty,
        imageUrl: loadedImageUrl,
      }),
    })

    const data = await res.json()
    if (res.ok) {
      setResult(`✅ Puzzle updated successfully`)
      return true
    } else {
      setResult(`❌ Error: ${data.error}`)
      return false
    }
  }

  // Handle removing a puzzle
  const handleRemove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('./api/remove-puzzle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: loadedPuzzleId }),
    })

    const data = await res.json()
    if (res.ok) {
      setResult(`✅ Puzzle removed successfully`)
      return true
    } else {
      setResult(`❌ Error: ${data.error}`)
      return false
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
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value=''>Select difficulty</option>
            <option value='easy'>Easy</option>
            <option value='medium'>Medium</option>
            <option value='hard'>Hard</option>
          </select>
          <button type='submit'>Add Puzzle</button>
        </form>
      </div>

      <div>
        <h1>Edit a Puzzle</h1>
        {!loadedPuzzle && (
          <form onSubmit={handleGetSubmit}>
            <input
              value={puzzleId}
              onChange={(e) => setPuzzleId(e.target.value)}
              placeholder='Puzzle id'
            />
            <input
              value={puzzleName}
              onChange={(e) => setPuzzleName(e.target.value)}
              placeholder='Puzzle name'
            />
            <button type='submit'>Load Puzzle</button>
          </form>
        )}
        {loadedPuzzle && (
          <form onSubmit={handleLoadedSubmit}>
            <input
              value={loadedNameEN}
              onChange={(e) => setLoadedNameEN(e.target.value)}
              placeholder='Puzzle Name'
              required
            />
            <input
              value={loadedNameLT}
              onChange={(e) => setLoadedNameLT(e.target.value)}
              placeholder='Pavadinimas lietuviškai'
              required
            />
            <input
              value={loadedImageUrl}
              onChange={(e) => setLoadedImageUrl(e.target.value)}
              placeholder='Image url (in */puzzles/)'
              required
            />
            <select
              value={loadedDifficulty}
              onChange={(e) => setLoadedDifficulty(e.target.value)}
            >
              <option value=''>Select difficulty</option>
              <option value='easy'>Easy</option>
              <option value='medium'>Medium</option>
              <option value='hard'>Hard</option>
            </select>
            <button type='submit' value='update'>
              Update Puzzle
            </button>
            <button type='submit' value='remove'>
              Remove Puzzle
            </button>
          </form>
        )}
      </div>

      {result && <p>{result}</p>}
    </div>
  )
}
