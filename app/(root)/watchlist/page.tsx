'use client';

import { getUserWatchlist } from '@/lib/actions/watchlist.actions';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, Trash2 } from 'lucide-react';
import { removeFromWatchlist } from '@/lib/actions/watchlist.actions';
import { WATCHLIST_TABLE_HEADER } from '@/lib/constants';

interface WatchlistItem {
  symbol: string;
  company?: string;
  currentPrice?: number;
  changePercent?: number;
  marketCap?: string;
  peRatio?: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWatchlist() {
      try {
        const response = await getUserWatchlist();
        if (response.success) {
          setWatchlist(response.data);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, []);

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      const response = await removeFromWatchlist(symbol);
      if (response.success) {
        setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Watchlist</h1>
        <div className="animate-pulse">Loading watchlist...</div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="watchlist-empty-container">
        <div className="watchlist-empty">
          <Star className="watchlist-star" />
          <h2 className="empty-title">Your watchlist is empty</h2>
          <p className="empty-description">
            Search for stocks and add them to your watchlist to keep track of your favorite investments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <div className="watchlist">
        <h1 className="watchlist-title">Your Watchlist</h1>
        <div className="overflow-x-auto">
          <table className="watchlist-table">
            <thead>
              <tr className="table-header-row">
                {WATCHLIST_TABLE_HEADER.map((header, index) => (
                  <th key={index} className="table-header px-4 py-3 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr key={item.symbol} className="table-row">
                  <td className="table-cell px-4 py-3">
                    <Link href={`/stocks/${item.symbol}`} className="hover:text-yellow-500">
                      {item.company || item.symbol}
                    </Link>
                  </td>
                  <td className="table-cell px-4 py-3">{item.symbol}</td>
                  <td className="table-cell px-4 py-3">
                    {item.currentPrice ? `$${item.currentPrice.toFixed(2)}` : '-'}
                  </td>
                  <td className="table-cell px-4 py-3">
                    {item.changePercent ? (
                      <span className={item.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    ) : '-'}
                  </td>
                  <td className="table-cell px-4 py-3">{item.marketCap || '-'}</td>
                  <td className="table-cell px-4 py-3">{item.peRatio || '-'}</td>
                  <td className="table-cell px-4 py-3">-</td>
                  <td className="table-cell px-4 py-3">
                    <button
                      onClick={() => handleRemoveFromWatchlist(item.symbol)}
                      className="watchlist-remove-btn"
                      aria-label="Remove from watchlist"
                    >
                      <Trash2 className="trash-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}