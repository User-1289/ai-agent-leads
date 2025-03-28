//delete the uid from the cookies
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();

    //delete the uid from the cookies
    try {
        cookieStore.delete("uid");
        cookieStore.delete("reddit_access_token");
        cookieStore.delete("reddit_refresh_token");
        cookieStore.delete("reddit_state");
        return NextResponse.json({ message: "User logged out successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to log out user", error: error.message }, { status: 500 });
    }
}