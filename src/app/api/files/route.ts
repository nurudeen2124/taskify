import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { supabase } from '@/lib/supabase'
import path from 'path'

// GET /api/files - Retrieve all files
export async function GET() {
  try {
    const files = await db.fileUpload.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(files)
  } catch (error) {
    console.error('Error fetching files:', error)
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
  }
}

// POST /api/files - Upload a file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()

    // Generate unique filename
    const ext = path.extname(file.name) || ''
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    
    // Upload to Supabase Storage bucket named 'uploads'
    const { data, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(uniqueName, bytes, {
        contentType: file.type || 'application/octet-stream',
        upsert: false
      })

    if (uploadError) {
      throw uploadError
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(uniqueName)

    const userId = formData.get('userId') as string | null

    const fileRecord = await db.fileUpload.create({
      data: {
        name: file.name,
        url: publicUrlData.publicUrl,
        size: file.size,
        type: file.type || 'application/octet-stream',
        userId: userId || null,
      },
    })

    return NextResponse.json(fileRecord, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
