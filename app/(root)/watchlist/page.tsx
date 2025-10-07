import { headers } from 'next/headers'
import { auth } from '@/lib/better-auth/auth'
import { getWatchlistItemsByUserId } from '@/lib/actions/watchlist.actions'
import { getStockSnapshot } from '@/lib/actions/finnhub.actions'
import RemoveFromWatchlistButton from '@/components/RemoveFromWatchlistButton'

// Ensure this page is not statically generated
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

//  Optional safeguard to skip during Vercel build
if (process.env.NODE_ENV === 'production' && process.env.VERCEL === '1') {
  console.log(' Skipping WatchlistPage data fetching during Vercel build')
}

export default async function WatchlistPage() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userId = session?.user?.id

    //  Return fallback UI instead of crashing at build time
    if (!userId) {
      return (
        <div className="text-gray-400 text-center py-10">
          Please sign in to view your watchlist.
        </div>
      )
    }

    const items = await getWatchlistItemsByUserId(userId)

    // Handle empty watchlist gracefully
    if (!items || items.length === 0) {
      return (
        <div className="text-gray-400 text-center py-10">
          Your watchlist is empty. Add stocks to get started!
        </div>
      )
    }

    const enriched = await Promise.all(
      items.map(async (i) => {
        const snap = await getStockSnapshot(i.symbol)
        return { ...i, snapshot: snap }
      })
    )

    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-gray-100">Your Watchlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enriched.map((it) => (
            <div key={it.symbol} className="border border-gray-700 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-gray-100 font-medium">{it.company}</div>
                  <div className="text-gray-500 text-sm">{it.symbol}</div>
                </div>
                <RemoveFromWatchlistButton symbol={it.symbol} />
              </div>
              <div className="text-gray-200 text-lg">
                {it.snapshot?.priceFormatted || '-'}
              </div>
              <div
                className={`text-sm ${
                  Number(it.snapshot?.changePercent) >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {it.snapshot?.changeFormatted || ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('WatchlistPage render error:', error)
    return (
      <div className="text-red-400 text-center py-10">
        Failed to load watchlist. Please try again later.
      </div>
    )
  }
}
