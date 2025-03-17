import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/lib/schemas/Feedback";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import FeedbackSchema from "@/lib/schemas/Feedback";
export async function POST(request: NextRequest) {

  const cookieStore = await cookies()
  const uid = cookieStore.get('uid')?.value
  console.log(uid)
  if(!uid){
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { answers } = await request.json();
  console.log(answers);

  if(!answers){
    return NextResponse.json({ message: "Answers are required" }, { status: 400 })
  }

  //connect to db
  if(!mongoose.connection.readyState){
    await mongoose.connect(process.env.MONGODB_URI as string)
  }
  const FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema)
  try {
    const feedback = new FeedbackModel({
      uid,
      answers
    })
    await feedback.save()
    return NextResponse.json({ message: "Feedback received" }, { status: 200 })
  } catch(error: any){
    console.log(error)
    return NextResponse.json({ message: "Internal server error when saving feedback", error: error.message }, { status: 500 })
  }
}