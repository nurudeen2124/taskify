import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/tasks - Retrieve all tasks
export async function GET() {
  try {
    const tasks = await db.task.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, status, priority, category, progress, dueDate } = body

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (title.trim().length > 200) {
      return NextResponse.json({ error: 'Title must be 200 characters or less' }, { status: 400 })
    }
    if (description && typeof description === 'string' && description.length > 1000) {
      return NextResponse.json({ error: 'Description must be 1000 characters or less' }, { status: 400 })
    }

    const validStatuses = ['pending', 'in-progress', 'completed']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }
    const validPriorities = ['low', 'medium', 'high']
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json({ error: 'Invalid priority value' }, { status: 400 })
    }
    const validCategories = ['personal', 'work', 'shopping', 'health']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category value' }, { status: 400 })
    }

    const task = await db.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || 'pending',
        priority: priority || 'medium',
        category: category || 'personal',
        progress: typeof progress === 'number' ? Math.min(100, Math.max(0, progress)) : 0,
        dueDate: dueDate || null,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}
