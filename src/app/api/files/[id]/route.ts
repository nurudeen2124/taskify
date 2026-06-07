import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { unlink } from 'fs/promises'
import path from 'path'

// DELETE /api/files/[id] - Delete a file
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const file = await db.fileUpload.findUnique({ where: { id } })
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Delete physical file
    const filename = file.url.split('/').pop()
    if (filename) {
      try {
        const filePath = path.join(process.cwd(), 'uploads', filename)
        await unlink(filePath)
      } catch {
        // File might not exist on disk, continue with DB deletion
      }
    }

    await db.fileUpload.delete({ where: { id } })

    return NextResponse.json({ message: 'File deleted successfully' })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
