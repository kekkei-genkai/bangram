import { NextRequest, NextResponse } from 'next/server'
import type { ResultSetHeader } from 'mysql2'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    const results = await db.execute<ResultSetHeader>(
      'SELECT id, name_en, name_lt, image_url FROM puzzles WHERE id = ?',
      [id],
    )

    if (!Array.isArray(results[0]) || results[0].length == 0) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 })
    }
    return NextResponse.json({ puzzle: results[0][0] }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
