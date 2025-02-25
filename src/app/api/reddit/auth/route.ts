import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const CLIENT_ID = process.env.REDDIT_APP_ID;
  const REDIRECT_URI = "http://localhost:4000/api/reddit/callback";

  if (!CLIENT_ID) {
    return NextResponse.json({ error: "Missing Reddit Client ID" }, { status: 500 });
  }

  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15);

  let cookieStore = await cookies();
  // Store the state in cookies (no need to await)
  cookieStore.set('reddit_state', state, { 
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax'
  });

  // Construct Reddit OAuth URL
  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&duration=permanent&scope=read`;

  return NextResponse.redirect(authUrl);
}