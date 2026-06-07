import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/tasks/[id] - Retrieve a single task
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const task = await db.task.findUnique({ where: { id } })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, status, priority, category, progress, dueDate } = body

    // Check if task exists
    const existingTask = await db.task.findUnique({ where: { id } })
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Validation
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        )
      }
      if (title.trim().length > 200) {
        return NextResponse.json(
          { error: 'Title must be 200 characters or less' },
          { status: 400 }
        )
      }
    }

    if (description !== undefined && description !== null && typeof description === 'string' && description.length > 1000) {
      return NextResponse.json(
        { error: 'Description must be 1000 characters or less' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'in-progress', 'completed']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const validPriorities = ['low', 'medium', 'high']
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority value' },
        { status: 400 }
      )
    }

    const validCategories = ['personal', 'work', 'shopping', 'health']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category value' },
        { status: 400 }
      )
    }

    const updatedTask = await db.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(category && { category }),
        ...(progress !== undefined && { progress: Math.min(100, Math.max(0, Number(progress))) }),
        ...(dueDate !== undefined && { dueDate: dueDate || null }),
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if task exists
    const existingTask = await db.task.findUnique({ where: { id } })
    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    await db.task.delete({ where: { id } })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
