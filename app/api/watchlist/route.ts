export const dynamic = "force-dynamic"; // 🚀 Prevents Next.js from pre-rendering this API route

import { NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlistItemsByUserId,
} from "@/lib/actions/watchlist.actions";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) return NextResponse.json({ items: [] }, { status: 200 });

    const items = await getWatchlistItemsByUserId(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/watchlist error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;
    if (!userId) return NextResponse.json({ success: false }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { action, symbol, company } = body || {};

    if (!action || !symbol)
      return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });

    if (action === "add") {
      const res = await addToWatchlist(userId, symbol, company);
      return NextResponse.json(res);
    }

    if (action === "remove") {
      const res = await removeFromWatchlist(userId, symbol);
      return NextResponse.json(res);
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    console.error("POST /api/watchlist error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
