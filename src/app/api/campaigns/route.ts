import { NextRequest, NextResponse } from "next/server";
import {LeadSchema} from "@/lib/schemas/Leads";
import mongoose from "mongoose";
import { cookies } from "next/headers";
export async function GET(request: NextRequest) {
    try {
        if (!mongoose.connection.readyState) {
          await mongoose.connect(process.env.MONGODB_URI as string);
        }
      
        const LeadModel = mongoose.models.Campaign || mongoose.model("Campaign", LeadSchema);
        const cookieStore = await cookies()
        const uid = cookieStore.get('uid')?.value
        if(!uid){
            return NextResponse.json({error:"No uid found"}, {status:400})
        }
        try {
          const campaign = await LeadModel.find({uid:uid});
          return NextResponse.json({campaign:campaign}, {status:200});
        } catch (error) {
          return NextResponse.json({error:"Failed to fetch campaign"}, {status:500});
        }
      } catch (error) {
        return NextResponse.json({error:"Failed to fetch campaign"}, {status:500});
      }
}