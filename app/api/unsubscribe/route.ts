import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    // Get email from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();
    const db = mongoose.connection.db;
    
    if (!db) {
      throw new Error("Failed to connect to database");
    }

    // Update user preferences to opt out of news emails
    const result = await db.collection("users").updateOne(
      { email },
      { $set: { newsEmailsEnabled: false } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return success page
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed - Stoxie</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #050505;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background-color: #141414;
            border-radius: 8px;
            border: 1px solid #30333A;
            padding: 40px;
            text-align: center;
          }
          h1 {
            color: #FDD458;
            margin-bottom: 20px;
          }
          p {
            color: #9ca3af;
            margin-bottom: 30px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            background-color: #FDD458;
            color: #000000;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          .button:hover {
            background-color: #e9c44a;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Successfully Unsubscribed</h1>
          <p>You have been unsubscribed from Stoxie news emails. You can resubscribe anytime from your account settings.</p>
          <a href="https://stoxie-eight.vercel.app/" class="button">Visit Stoxie</a>
        </div>
      </body>
      </html>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return NextResponse.json(
      { success: false, message: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}