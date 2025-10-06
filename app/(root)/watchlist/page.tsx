import { headers } from 'next/headers'
import { auth } from '@/lib/better-auth/auth'
import { getWatchlistItemsByUserId } from '@/lib/actions/watchlist.actions'
import { getStockSnapshot } from '@/lib/actions/finnhub.actions'
import RemoveFromWatchlistButton from '@/components/RemoveFromWatchlistButton'

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userId = session?.user?.id
  if (!userId) return null

  const items = await getWatchlistItemsByUserId(userId)
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
            <div className="text-gray-200 text-lg">{it.snapshot?.priceFormatted || '-'}</div>
            <div className={`text-sm ${Number(it.snapshot?.changePercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {it.snapshot?.changeFormatted || ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


