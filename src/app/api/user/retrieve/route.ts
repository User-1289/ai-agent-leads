import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { FreelancingInfoSchema } from "@/lib/schemas/FreelancingInfo";
import { cookies } from "next/headers";
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  let cookieStore = await cookies()

  let uid = cookieStore.get('uid')?.value
  
  if (!uid) {
    uid = searchParams.get("uid") as string
  }
  if (!uid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }
  

  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 })
  }

  const userInfo = mongoose.models.users || mongoose.model("users", UserSchema)
  const user = await userInfo.findOne({ uid: uid })
  console.log(user)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json(user)
}