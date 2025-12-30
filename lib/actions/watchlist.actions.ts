'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { revalidatePath } from 'next/cache';

export async function addToWatchlist(email: string, symbol: string, company: string) {
  if (!email || !symbol || !company) {
    return { success: false, message: 'Missing required fields' };
  }

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Get user from Better Auth collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) {
      return { success: false, message: 'Invalid user ID' };
    }

    // Check if already exists
    const exists = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    if (exists) {
      return { success: false, message: 'Already in watchlist' };
    }

    // Add to watchlist
    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    revalidatePath('/watchlist');
    revalidatePath(`/stocks/${symbol}`);

    return { success: true, message: 'Added to watchlist' };
  } catch (err) {
    console.error('addToWatchlist error:', err);
    return { success: false, message: 'Failed to add to watchlist' };
  }
}

export async function removeFromWatchlist(email: string, symbol: string) {
  if (!email || !symbol) {
    return { success: false, message: 'Missing required fields' };
  }

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) {
      return { success: false, message: 'Invalid user ID' };
    }

    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });

    revalidatePath('/watchlist');
    revalidatePath(`/stocks/${symbol}`);

    return { success: true, message: 'Removed from watchlist' };
  } catch (err) {
    console.error('removeFromWatchlist error:', err);
    return { success: false, message: 'Failed to remove from watchlist' };
  }
}

export async function getWatchlistStocks(email: string) {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean();

    return items.map((item) => ({
      symbol: String(item.symbol),
      company: String(item.company),
      addedAt: item.addedAt.toISOString(),
    }));
  } catch (err) {
    console.error('getWatchlistStocks error:', err);
    return [];
  }
}

export async function checkIsInWatchlist(email: string, symbol: string): Promise<boolean> {
  if (!email || !symbol) return false;

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return false;

    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return false;

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return false;

    const exists = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() });
    return !!exists;
  } catch (err) {
    console.error('checkIsInWatchlist error:', err);
    return false;
  }
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean();

    // Return only the symbols as an array of strings
    return items.map((item) => String(item.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}