'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.models';

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
export async function addToWatchlist(userId: string, symbol: string, company: string) {
  if (!userId || !symbol || !company) return { success: false };

  try {
    await connectToDatabase();

    await Watchlist.updateOne(
      { userId, symbol: symbol.toUpperCase() },
      { $setOnInsert: { company, addedAt: new Date() } },
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
export async function removeFromWatchlist(userId: string, symbol: string) {
  if (!userId || !symbol) return { success: false };

  try {
    await connectToDatabase();
    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    return { success: true };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false };
  }
}

/**
 * Get all watchlist items for a user.
 */
export async function getWatchlistItemsByUserId(
  userId: string
): Promise<{ symbol: string; company: string; addedAt: Date }[]> {
  if (!userId) return [];

  try {
    await connectToDatabase();

    const items = await Watchlist.find({ userId }, { symbol: 1, company: 1, addedAt: 1 }).lean();

    return items.map((i) => ({
      symbol: String(i.symbol),
      company: String(i.company),
      addedAt: i.addedAt instanceof Date ? i.addedAt : new Date(i.addedAt),
    }));
  } catch (err) {
    console.error('getWatchlistItemsByUserId error:', err);
    return [];
  }
}
