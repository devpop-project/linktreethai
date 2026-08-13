import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { username } = await request.json()
    if (username && typeof username === 'string') {
      revalidatePath(`/${username}`)
    }
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}
