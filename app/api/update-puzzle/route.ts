import { NextRequest, NextResponse } from 'next/server'
import type { ResultSetHeader } from 'mysql2'
import db from '@/lib/db'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, nameEN, nameLT, difficulty, imageUrl } = body

    if (!nameEN || !nameLT || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing name or imageUrl' },
        { status: 400 },
      )
    }
    const imagePath = path.join(process.cwd(), 'public', 'puzzles', imageUrl)
    try {
      await fs.promises.access(imagePath, fs.constants.F_OK)
    } catch {
      return NextResponse.json(
        { error: 'Image not found in */puzzles/ directory' },
        { status: 400 },
      )
    }

    await db.execute<ResultSetHeader>(
      'UPDATE puzzles SET name_en = ?, name_lt = ?, difficulty = ?, image_url = ? WHERE id = ?',
      [nameEN, nameLT, difficulty == '' ? null : difficulty, imageUrl, id],
    )

    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
