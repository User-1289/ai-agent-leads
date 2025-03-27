//check if the user has already submitted feedback

import { NextRequest, NextResponse } from "next/server"
import Feedback from "@/lib/schemas/Feedback"
import { cookies } from "next/headers"
import mongoose from "mongoose"
import FeedbackSchema from "@/lib/schemas/Feedback"

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const uid = cookieStore.get('uid')?.value
  if(!uid){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
  } catch(error: any){
    return NextResponse.json({ message: "Failed to connect to database", error: error.message }, { status: 500 })
  }

  try {
    const FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)
    const feedback = await FeedbackModel.find({ uid })
    if(feedback.length === 0){
      return NextResponse.json({ hasFeedback: false })
    }
    return NextResponse.json({ hasFeedback: true })
  } catch(error: any){
    return NextResponse.json({ message: "Failed to check feedback", error: error.message }, { status: 500 })
  }
}