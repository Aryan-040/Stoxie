import { NextResponse } from 'next/server'
import { auth } from '@/lib/better-auth/auth'
import { headers } from 'next/headers'
import { addToWatchlist, removeFromWatchlist, getWatchlistItemsByUserId } from '@/lib/actions/watchlist.actions'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ items: [] }, { status: 200 })

  const items = await getWatchlistItemsByUserId(userId)
  return NextResponse.json({ items })
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ success: false }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { action, symbol, company } = body || {}

  if (action === 'add') {
    const res = await addToWatchlist(userId, symbol, company)
    return NextResponse.json(res)
  }
  if (action === 'remove') {
    const res = await removeFromWatchlist(userId, symbol)
    return NextResponse.json(res)
  }

  return NextResponse.json({ success: false }, { status: 400 })
}
