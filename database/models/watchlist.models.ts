import mongoose, { Schema } from 'mongoose';

// Define the Watchlist schema
const WatchlistSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  symbols: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create or retrieve the Watchlist model
export const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema);

// Define TypeScript interfaces for the Watchlist
export interface WatchlistItem {
  symbol: string;
}

export interface WatchlistDocument extends mongoose.Document {
  userId: string;
  symbols: string[];
  createdAt: Date;
  updatedAt: Date;
}