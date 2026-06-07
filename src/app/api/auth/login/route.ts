import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!password || typeof password !== 'string' || password.length === 0) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const user = await db.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}
