import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// PUT /api/notes/[id] - Update a note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content } = body

    const existing = await db.note.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const updated = await db.note.update({
      where: { id },
      data: { content: content.trim() },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 })
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await db.note.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 })
    }

    await db.note.delete({ where: { id } })
    return NextResponse.json({ message: 'Note deleted successfully' })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}
