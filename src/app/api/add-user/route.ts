import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { cookies } from "next/headers";
export async function POST(request:NextRequest){
    const body = await request.json()
    const {email, name, uid, createdAt, isEmailVerified, signedIn} = body
    
    const User = mongoose.models.User || mongoose.model("User", UserSchema)
    if(!mongoose.connection.readyState){
        await mongoose.connect(process.env.MONGODB_URI as string)
    }

    try {
        const user = new User({
            email,
            name,
            uid,
            createdAt,
            isEmailVerified,
            signedIn
        })
        await user.save()

        const cookieStore = await cookies()
        cookieStore.set("uid", uid)
        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
}