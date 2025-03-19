import { NextRequest, NextResponse } from "next/server";
import {LeadSchema} from "@/lib/schemas/Leads";
import mongoose from "mongoose";

export async function GET(context: { params: { id: string } }) {
  const { id } = context.params;
  console.log(id)
  if(!id){
    return NextResponse.json({error:"No id provided"}, {status:400})
  }

try {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGODB_URI as string);
  }

  const LeadModel = mongoose.models.Campaign || mongoose.model("Campaign", LeadSchema);

  try {
    const campaign = await LeadModel.findOne({campaign_id:id})
    //sort them based on the date'
    const sortedLeads = campaign?.potential_leads.sort((a:any, b:any) => new Date(b.post_created_utc).getTime() - new Date(a.post_created_utc).getTime());
    campaign.potential_leads = sortedLeads
    console.log(sortedLeads )
    return NextResponse.json({campaign:campaign}, {status:200});
  } catch (error) {
    return NextResponse.json({error:"Failed to fetch campaign"}, {status:500});
  }
} catch (error) {
  return NextResponse.json({error:"Failed to fetch campaign"}, {status:500});
}
  
}