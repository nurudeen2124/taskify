import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/notes - Retrieve all notes
export async function GET() {
  try {
    const notes = await db.note.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    return NextResponse.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (content.length > 5000) {
      return NextResponse.json({ error: 'Content must be 5000 characters or less' }, { status: 400 })
    }

    const note = await db.note.create({
      data: { content: content.trim() },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
