import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserSchema } from "@/lib/schemas/UserSchema";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
export async function POST(request:NextRequest){
    const body = await request.json()
    const {email, name, uid, createdAt, isEmailVerified, signedIn, plan} = body
    let finalPlan = plan
    const User = mongoose.models.User || mongoose.model("User", UserSchema)
    if(!mongoose.connection.readyState){
        await mongoose.connect(process.env.MONGODB_URI as string)
    }
    const count = await User.countDocuments()
    if(count < 50){
        finalPlan = "Pro"
    } else if(count>50){
        finalPlan = "Free"
    }

    try {
        const user = new User({
            email,
            name,
            uid,
            createdAt,
            isEmailVerified,
            signedIn,
            plan: finalPlan
        })
        await user.save()

        const cookieStore = await cookies()
        cookieStore.set("uid", uid, {
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Set cookie to expire in 1 year
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'strict'
        })
        let sendMsg = await sendEmailToFounder(email)
        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

async function sendEmailToFounder(userEmail: string) {
    const founderEmail = process.env.FOUNDER_EMAIL
    let transporter = nodemailer.createTransport({
        host: "smtp.zoho.in",
        port: 465,
        secure:true,
        auth: {
          user: "armaan@frankleads.io",
          pass: process.env.EMAIL_PASSWORD!,
        },
    })

    try {
        let info = await transporter.sendMail({
          from: '"FrankLeads" <armaan@frankleads.io>',
          to: "armaan@frankleads.io, wesley@frankleads.io",
          subject: "Yay! A new user has signed up",
          html: `A new user has signed up!<br>Email: ${userEmail}`,
        })
    
        console.log("Message sent to founders: %s", info.messageId)
      } catch (error) {
        console.error(error)
      }
}