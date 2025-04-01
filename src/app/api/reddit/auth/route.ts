import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/dist/server/api-utils';
export async function GET(request: NextRequest) {
  //first check if the user is already logged in
  let cookieStore = await cookies();
  //const accessToken = cookieStore.get('reddit_access_token')?.value;
  //if(accessToken){
  //  return NextResponse.redirect(new URL('/dashboard?already_integrated_reddit=true', request.url));
  //}

  const CLIENT_ID = process.env.REDDIT_APP_ID;
  const REDIRECT_URI = process.env.REDDIT_REDIRECT_URI as string || "http://localhost:4000/api/reddit/callback"

  if (!CLIENT_ID || !REDIRECT_URI) {
    return NextResponse.json({ error: "Missing Reddit Client ID or Redirect URI" }, { status: 500 });
  }

  // Generate a random state for CSRF protection
  const state = Math.random().toString(36).substring(2, 15);

  // Store the state in cookies (no need to await)
  cookieStore.set('reddit_state', state, { 
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'lax'
  });

  // Construct Reddit OAuth URL
  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&duration=permanent&scope=read`;

  return NextResponse.json({
    status: true,
    redirectUrl: authUrl,
    message: "Redirecting to Reddit for authentication"
  }, { status: 200});
  
}
