import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/share - Get all shared members
export async function GET() {
  try {
    const shares = await db.sharedMember.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(shares)
  } catch (error) {
    console.error('Error fetching shares:', error)
    return NextResponse.json({ error: 'Failed to fetch shares' }, { status: 500 })
  }
}

// POST /api/share - Share task list (send email invite)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, userId } = body

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const shareLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/shared/${Date.now()}`

    const share = await db.sharedMember.create({
      data: {
        email: email.trim().toLowerCase(),
        shareLink,
        userId: userId || null,
      },
    })

    // In a production app, you would send an actual email here
    // using a service like SendGrid, Resend, or Nodemailer.
    // For this implementation, we generate a mailto link and share link
    // that the user can use to share manually.

    const mailtoLink = `mailto:${email.trim()}?subject=I%20shared%20my%20Taskify%20task%20list%20with%20you&body=Hi%2C%0A%0AI%27ve%20shared%20my%20task%20list%20with%20you%20on%20Taskify.%0A%0AClick%20here%20to%20view%3A%20${encodeURIComponent(shareLink)}%0A%0AThanks!`

    return NextResponse.json({
      share,
      mailtoLink,
      shareLink,
      message: `Share invitation created for ${email}`,
    }, { status: 201 })
  } catch (error) {
    console.error('Error sharing task list:', error)
    return NextResponse.json({ error: 'Failed to share task list' }, { status: 500 })
  }
}

// DELETE /api/share - Remove a shared member
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 })
    }

    const share = await db.sharedMember.findUnique({ where: { id } })
    if (!share) {
      return NextResponse.json({ error: 'Share not found' }, { status: 404 })
    }

    await db.sharedMember.delete({ where: { id } })

    return NextResponse.json({ message: 'Share removed successfully' })
  } catch (error) {
    console.error('Error removing share:', error)
    return NextResponse.json({ error: 'Failed to remove share' }, { status: 500 })
  }
}
