//delete the uid from the cookies
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();

    //delete the uid from the cookies
    try {
        cookieStore.delete("uid");
        return NextResponse.json({ message: "User logged out successfully" });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to log out user", error: error.message }, { status: 500 });
    }
}