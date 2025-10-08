'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.models';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { getStockSnapshot } from './finnhub.actions';

interface WatchlistItem {
  symbol: string;
  company?: string;
  currentPrice?: number;
  changePercent?: number;
  marketCap?: string;
  peRatio?: string;
}

interface WatchlistResponse {
  success: boolean;
  data: WatchlistItem[];
}

/**
 * Get company profile data for market cap and P/E ratio
 */
async function getCompanyProfile(symbol: string) {
  try {
    const token = process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) return null;
    
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${token}`;
    const response = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      marketCap: data.marketCapitalization ? `$${(data.marketCapitalization / 1000).toFixed(2)}B` : 'N/A',
      peRatio: data.peRatio ? data.peRatio.toFixed(2) : 'N/A'
    };
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return null;
  }
}

/**
 * Get the current user's watchlist
 */
export async function getUserWatchlist(): Promise<WatchlistResponse> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.email) {
      return { success: false, data: [] };
    }

    // Get watchlist items with company names
    const items = await getWatchlistItemsByUserId(session.user.id || '');
    
    // Fetch stock data for each symbol
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        const stockData = await getStockSnapshot(item.symbol);
        const profileData = await getCompanyProfile(item.symbol);
        
        return {
          symbol: item.symbol,
          company: item.company || item.symbol,
          currentPrice: stockData?.currentPrice,
          changePercent: stockData?.changePercent,
          marketCap: profileData?.marketCap || 'N/A',
          peRatio: profileData?.peRatio || 'N/A',
        };
      })
    );

    return { 
      success: true, 
      data: enrichedItems
    };
  } catch (error) {
    console.error('Error getting user watchlist:', error);
    return { success: false, data: [] };
  }
}

/**
 * Get all stock symbols for a given user's email.
 */
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection?.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth users are stored in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = typeof user.id === 'string' ? user.id : String(user._id ?? '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

/**
 * Add a stock to a user's watchlist.
 */
export async function addToWatchlist(symbol: string, company: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false };
    }

    await connectToDatabase();

    await Watchlist.updateOne(
      { userId: session.user.id },
      { $addToSet: { symbols: symbol.toUpperCase() } },
      { upsert: true }
    );

    return { success: true };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false };
  }
}

/**
 * Remove a stock from a user's watchlist.
 */
export async function removeFromWatchlist(symbol: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false };
    }

    await connectToDatabase();
    await Watchlist.deleteOne({ userId: session.user.id, symbol: symbol.toUpperCase() });
    return { success: true };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false };
  }
}

/**
 * Check if a stock is in the user's watchlist
 */
export async function isInWatchlist(symbol: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return false;
    }

    await connectToDatabase();
    const item = await Watchlist.findOne({ 
      userId: session.user.id, 
      symbol: symbol.toUpperCase() 
    });
    
    return !!item;
  } catch (err) {
    console.error('isInWatchlist error:', err);
    return false;
  }
}

/**
 * Get all watchlist items for a user.
 */
export async function getWatchlistItemsByUserId(
  userId: string
): Promise<{ symbol: string; company: string; addedAt?: Date }[]> {
  if (!userId) return [];

  try {
    await connectToDatabase();

    const watchlist = await Watchlist.findOne({ userId }).lean();
    
    if (!watchlist) {
      return [];
    }
    
    // Type assertion to access symbols property
    const watchlistDoc = watchlist as { symbols?: string[], createdAt?: Date };
    
    if (!watchlistDoc.symbols || !Array.isArray(watchlistDoc.symbols)) {
      return [];
    }
    
    return watchlistDoc.symbols.map((symbol: string) => ({
      symbol: String(symbol),
      company: symbol,
      addedAt: watchlistDoc.createdAt || new Date(),
    }));
  } catch (err) {
    console.error('getWatchlistItemsByUserId error:', err);
    return [];
  }
}
