import { NextRequest, NextResponse } from "next/server";

export default async function POST(request:NextRequest){
    const body = await request.json()
    const {email, name, uid, createdAt, isEmailVerified} = body
}