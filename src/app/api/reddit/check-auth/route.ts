//check if the reddit_access_token exists in the cookie store, if not create a new one with the refresh token
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';
export async function GET(request: NextRequest) {
    let cookieStore = await cookies();
    const accessToken = cookieStore.get('reddit_access_token')?.value;
    if (!accessToken) {
        return NextResponse.redirect(new URL('/api/reddit/auth', request.url));
    } else {
        return NextResponse.redirect(new URL('/dashboard?already_integrated_reddit=true', request.url));  }
}