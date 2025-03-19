import { NextRequest, NextResponse } from "next/server";
import { LeadSchema } from "@/lib/schemas/Leads";
import mongoose from "mongoose";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params; // Extract ID from params
  console.log(id);

  if (!id) {
    return NextResponse.json({ error: "No id provided" }, { status: 400 });
  }

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const LeadModel = mongoose.models.Campaign || mongoose.model("Campaign", LeadSchema);

    try {
      const campaign = await LeadModel.findOne({ campaign_id: id });

      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }

      // Sort leads based on date
      campaign.potential_leads = campaign.potential_leads.sort(
        (a: any, b: any) => new Date(b.post_created_utc).getTime() - new Date(a.post_created_utc).getTime()
      );

      console.log(campaign.potential_leads);
      return NextResponse.json({ campaign }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch campaign" }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Database connection error" }, { status: 500 });
  }
}