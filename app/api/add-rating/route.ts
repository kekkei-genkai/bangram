import { NextRequest, NextResponse } from 'next/server'
import type { ResultSetHeader } from 'mysql2'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { puzzleId, userId, difficulty } = body

    await db.execute<ResultSetHeader>(
      'INSERT INTO user_ratings (puzzle_id, user_id, difficulty) VALUES (?, ?, ?)',
      [puzzleId, userId, difficulty],
    )

    return NextResponse.json({}, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
