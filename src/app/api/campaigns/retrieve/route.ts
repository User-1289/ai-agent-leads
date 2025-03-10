import { NextRequest, NextResponse } from "next/server";
import {LeadSchema} from "@/lib/schemas/Leads";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url)
    const campaign_id = searchParams.get("campaign_id")
    console.log(campaign_id)
try {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  const LeadModel = mongoose.models.Campaign || mongoose.model("Campaign", LeadSchema);

  try {
    const campaign = await LeadModel.findOne({campaign_id:campaign_id});
    return NextResponse.json({campaign:campaign}, {status:200});
  } catch (error) {
    return NextResponse.json({error:"Failed to fetch campaign"}, {status:500});
  }
} catch (error) {
  return NextResponse.json({error:"Failed to fetch campaign"}, {status:500});
}
  
}