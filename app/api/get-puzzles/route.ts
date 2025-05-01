import { NextResponse } from 'next/server'
import type { ResultSetHeader } from 'mysql2'
import db from '@/lib/db'

export async function GET() {
  try {
    const results = await db.execute<ResultSetHeader>(
      'SELECT id, name_en, name_lt, image_url FROM puzzles',
    )

    if (!Array.isArray(results[0]) || results[0].length == 0) {
      return NextResponse.json(
        { error: 'No puzzles in database' },
        { status: 200 },
      )
    }
    return NextResponse.json({ puzzles: results[0] }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
