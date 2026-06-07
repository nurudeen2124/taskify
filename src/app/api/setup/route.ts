import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/setup - Check if database is ready
// POST /api/setup - Seed the database with a demo user and sample tasks
export async function GET() {
  try {
    const userCount = await db.user.count()
    const taskCount = await db.task.count()
    return NextResponse.json({
      ready: true,
      users: userCount,
      tasks: taskCount,
    })
  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json({ ready: false, error: 'Database not connected' }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Check if demo user already exists
    const existingUser = await db.user.findUnique({
      where: { email: 'demo@taskify.com' },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Database already seeded', userId: existingUser.id })
    }

    // Create demo user
    const user = await db.user.create({
      data: {
        name: 'Demo User',
        email: 'demo@taskify.com',
        password: 'demo1234',
      },
    })

    // Create sample tasks
    await db.task.createMany({
      data: [
        { title: 'Design new dashboard layout', description: 'Create wireframes for the updated dashboard with improved navigation', status: 'in-progress', priority: 'high', category: 'work', progress: 65, dueDate: '2026-06-15', userId: user.id },
        { title: 'Review project proposal', description: 'Go through the Q3 project proposal and provide feedback', status: 'pending', priority: 'high', category: 'work', progress: 0, dueDate: '2026-06-10', userId: user.id },
        { title: 'Grocery shopping', description: 'Buy fruits, vegetables, and snacks for the week', status: 'pending', priority: 'medium', category: 'shopping', progress: 0, dueDate: '2026-06-08', userId: user.id },
        { title: 'Morning workout routine', description: '30 minutes cardio + 15 minutes stretching', status: 'completed', priority: 'medium', category: 'health', progress: 100, dueDate: '2026-06-07', userId: user.id },
        { title: 'Read "Atomic Habits"', description: 'Finish chapters 5-8 this week', status: 'in-progress', priority: 'low', category: 'personal', progress: 40, dueDate: '2026-06-20', userId: user.id },
        { title: 'Update portfolio website', description: 'Add recent projects and update the about section', status: 'pending', priority: 'medium', category: 'personal', progress: 10, dueDate: '2026-06-18', userId: user.id },
      ],
    })

    // Create sample notes
    await db.note.createMany({
      data: [
        { content: 'Remember to back up the database before the migration on Friday', userId: user.id },
        { content: 'Meeting notes: Team agreed on using the new API design pattern. Follow up with backend team next week.', userId: user.id },
      ],
    })

    return NextResponse.json({
      message: 'Database seeded successfully!',
      userId: user.id,
      hint: 'You can now login with email: demo@taskify.com / password: demo1234',
    }, { status: 201 })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database. Make sure the database tables exist.' }, { status: 500 })
  }
}
