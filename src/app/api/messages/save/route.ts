import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { LeadSchema } from "@/lib/schemas/Leads"; 

import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    let cookieStore = await cookies();
    let uid = cookieStore.get('uid')?.value;

    let searchParams = new URL(request.url).searchParams;
 
    /*
    if(!uid) {
        uid = searchParams.get('uid') as string;
    }

    if (!uid) {
        return NextResponse.json({ message: 'Unauthorized', error: 'Mate, why trying to call our api unauthorized' }, { status: 400 });
    }
    */
    // Check if the request has a valid JSON body
    let body = await request.json()
    if (!body) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    let campaignId = searchParams.get('campaign_id') as string;
    let postUrl = searchParams.get('post_url') as string;

    if (!campaignId) {
        return NextResponse.json({ error: 'Missing campaign_id parameter' }, { status: 400 });
    }
    if (!postUrl) { 
        return NextResponse.json({ error: 'Missing post_url parameter' }, { status: 400 });
    }

    let message = body.personalized_message;
    if (!message) {
        return NextResponse.json({ error: 'Missing message parameter' }, { status: 400 });
    }

    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI as string)
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json({ error: 'MongoDB connection error' }, { status: 500 });
    }

    try{
    //get the document with the campaign_id
    const LeadModel = mongoose.models.Campaign || mongoose.model("Campaign", LeadSchema);
    const lead = await LeadModel.findOne({ campaign_id: parseInt(campaignId) });
    if (!lead) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    //update the document with the personalized message by looping through the potential_leads array and checking if the post_url is the same as the one in the array
    let finalLeads:any = []
    //const updatedLeads = lead.potential_leads.map((potentialLead:any) => {
    //    if (potentialLead.post_url === postUrl) {
    //        finalLeads.push({
    //            ...potentialLead,
    //            personalized_message: message,
    //        });
    //    } else {
    //        finalLeads.push(potentialLead);
    //    }
    //});
    const leadsHere = lead.potential_leads
    for(let i = 0; i < lead.potential_leads.length; i++) {
        // Get the raw data by converting to JSON and back
        const cleanObject = JSON.parse(JSON.stringify(lead.potential_leads[i]));
        
        // Remove any properties that start with underscore (internal MongoDB stuff)
        Object.keys(cleanObject).forEach(key => {
            if (key.startsWith('_')) {
                delete cleanObject[key];
            }
        });
        
        if(lead.potential_leads[i].post_url === postUrl) {
            // Add the personalized message
            cleanObject.personalized_message = message;

        }
        
        finalLeads.push(cleanObject);
    }
    
    //return NextResponse.json({ message: 'Message saved successfully', lead: finalLeads }, { status: 200 });
    //
    //return NextResponse.json({ message: 'Message saved successfully', lead:finalLeads }, { status: 200 });
    //update the document with the updatedLeads
    const updatedLead = await LeadModel.findOneAndUpdate(
        { campaign_id: parseInt(campaignId) },
        { potential_leads: finalLeads },
        { new: true }
    );
    await mongoose.connection.close();
    return NextResponse.json({ message: 'Message saved successfully', lead: updatedLead }, { status: 200 });

    }catch (error) {
        console.error('Error saving message:', error);
        return NextResponse.json({ message: 'Error saving message', error:error }, { status: 500 });
    }

}