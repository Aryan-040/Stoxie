'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/lib/actions/watchlist.actions';
import Link from 'next/link';

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist?: boolean;
}

export default function WatchlistButton({ symbol, company, isInWatchlist: initialIsInWatchlist }: WatchlistButtonProps) {
  const [isInList, setIsInList] = useState(initialIsInWatchlist || false);
  const [loading, setLoading] = useState(!initialIsInWatchlist);

  useEffect(() => {
    async function checkWatchlist() {
      if (initialIsInWatchlist !== undefined) {
        setIsInList(initialIsInWatchlist);
        setLoading(false);
        return;
      }
      
      try {
        const result = await isInWatchlist(symbol);
        setIsInList(result);
      } catch (error) {
        console.error('Error checking watchlist:', error);
      } finally {
        setLoading(false);
      }
    }

    checkWatchlist();
  }, [symbol, initialIsInWatchlist]);

  const handleAddToWatchlist = async () => {
    try {
      setLoading(true);
      const response = await addToWatchlist(symbol, company);
      if (response.success) {
        setIsInList(true);
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      setLoading(true);
      const response = await removeFromWatchlist(symbol);
      if (response.success) {
        setIsInList(false);
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Button disabled className="watchlist-btn">Loading...</Button>;
  }

  if (isInList) {
    return (
      <div className="flex gap-2 w-full">
        <Link href="/watchlist" className="watchlist-btn watchlist-goto w-full">
          <Star className="h-4 w-4" /> Go to Watchlist
        </Link>
      </div>
    );
  }

  return (
    <Button onClick={handleAddToWatchlist} className="watchlist-btn">
      <Star className="h-4 w-4 mr-2" /> Add to Watchlist
    </Button>
  );
}

