import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { LeadSchema } from "@/lib/schemas/Leads";
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
        return NextResponse.json({ error: 'Missing uid' }, { status: 400 });
    }

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }

    try {
        const LeadModel = mongoose.models.Leads || mongoose.model("Leads", LeadSchema);
        const leads = await LeadModel
            .find({ uid })
            .sort({ post_created_utc: -1 })

        return NextResponse.json(leads);
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}