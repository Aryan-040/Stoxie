import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";

// Ensure no server functions are called at module scope

export async function POST(request: NextRequest) {
  try {
    // Parse request body inside handler
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Call server action only inside handler function
    const response = await auth.api.signInEmail({ 
      body: { email, password } 
    });
    
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