import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
  }

  const cookieStore = await cookies();
  // Retrieve stored state from cookies (don't await)
  const savedState = cookieStore.get('reddit_state')?.value;

  // Validate state for CSRF protection
  if (!state || state !== savedState) {
    return NextResponse.json({ error: "Invalid state parameter" }, { status: 400 });
  }

  const CLIENT_ID = process.env.REDDIT_APP_ID;
  const CLIENT_SECRET = process.env.REDDIT_APP_SECRET;
  const REDIRECT_URI = "http://localhost:4000/api/reddit/callback"; // Ensure this matches Reddit App settings

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ error: "Missing Reddit Client credentials" }, { status: 500 });
  }

  try {
    // Exchange authorization code for access & refresh tokens
    const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || tokenData.error) {
      console.error("Reddit OAuth Error:", tokenData);
      return NextResponse.json({ error: tokenData.error || "Failed to fetch tokens" }, { status: 400 });
    }

    // Store tokens securely in cookies (or a database)
    cookieStore.set("reddit_access_token", tokenData.access_token, { httpOnly: true, secure: true, sameSite: "lax" });
    cookieStore.set("reddit_refresh_token", tokenData.refresh_token, { httpOnly: true, secure: true, sameSite: "lax" });

    // Redirect to your frontend's success page
    return NextResponse.redirect("http://localhost:4000/dashboard");

  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 });
  }
}