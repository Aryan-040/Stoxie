"use client";

import { useState } from "react";

type RemoveFromWatchlistButtonProps = {
  symbol: string;
};

export default function RemoveFromWatchlistButton({ symbol }: RemoveFromWatchlistButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    if (isRemoving) return;
    
    setIsRemoving(true);
    try {
      // Fire-and-forget API call
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', symbol }),
      });
      
      // Refresh the page to show updated watchlist
      window.location.reload();
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <button 
      className="watchlist-remove-btn" 
      onClick={handleRemove}
      disabled={isRemoving}
      title={`Remove ${symbol} from watchlist`}
      aria-label={`Remove ${symbol} from watchlist`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}