import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const response = await auth.api.signInEmail({ body: { email, password } });
    
    return NextResponse.json({ success: true, data: response });
  } catch (e) {
    console.error('Sign in failed', e);
    return NextResponse.json(
      { 
        success: false, 
        error: e instanceof Error ? e.message : 'Failed to sign in' 
      },
      { status: 500 }
    );
  }
}