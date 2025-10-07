import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { addToWatchlist, removeFromWatchlist, getWatchlistItemsByUserId } from '@/lib/actions/watchlist.actions'

// Create a simple session handler that doesn't depend on auth
const getSessionData = async () => {
  try {
    // Try to import auth dynamically
    const { auth } = await import('@/lib/better-auth/auth').catch(() => ({ auth: undefined }));
    
    if (auth?.api?.getSession) {
      return auth.api.getSession({ headers: await headers() }).catch(() => null);
    }
  } catch (error) {
    console.error('Auth module error:', error);
  }
  
  // Return null session if auth fails
  return null;
};

export async function GET() {
  try {
    const session = await getSessionData();
    const userId = session?.user?.id;
    
    if (!userId) {
      console.log('No user ID found in session, returning empty items array');
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const items = await getWatchlistItemsByUserId(userId).catch(error => {
      console.error('Error fetching watchlist items:', error);
      return [];
    });
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Unexpected error in GET /api/watchlist:', error);
    return NextResponse.json({ items: [], error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionData();
    const userId = session?.user?.id;
    
    if (!userId) {
      console.log('No user ID found in session, unauthorized');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, symbol, company } = body || {};

    if (!action) {
      return NextResponse.json({ success: false, error: 'Missing action parameter' }, { status: 400 });
    }

    if (action === 'add') {
      if (!symbol || !company) {
        return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
      }
      const res = await addToWatchlist(userId, symbol, company).catch(error => {
        console.error('Error adding to watchlist:', error);
        return { success: false, error: 'Failed to add to watchlist' };
      });
      return NextResponse.json(res);
    }
    
    if (action === 'remove') {
      if (!symbol) {
        return NextResponse.json({ success: false, error: 'Missing symbol parameter' }, { status: 400 });
      }
      const res = await removeFromWatchlist(userId, symbol).catch(error => {
        console.error('Error removing from watchlist:', error);
        return { success: false, error: 'Failed to remove from watchlist' };
      });
      return NextResponse.json(res);
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Unexpected error in POST /api/watchlist:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}


