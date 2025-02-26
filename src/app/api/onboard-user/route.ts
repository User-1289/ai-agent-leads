import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { FreelancingInfoSchema } from "@/lib/schemas/FreelancingInfo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, skills, services, platform_integrations } = body;

    // Validate required fields
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Get or create the FreelancingInfo model
    const FreelancingInfo = mongoose.models.FreelanceInfo || 
      mongoose.model("FreelanceInfo", FreelancingInfoSchema);

    // Check if a record already exists for this user
    const existingInfo = await FreelancingInfo.findOne({ uid });

    if (existingInfo) {
      // Update existing record
      existingInfo.skills = skills || existingInfo.skills;
      existingInfo.services = services || existingInfo.services;
      existingInfo.platform_integrations = platform_integrations || existingInfo.platform_integrations;
      existingInfo.updatedAt = new Date();
      
      await existingInfo.save();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Freelancing information updated successfully' 
      });
    } else {
      // Create new record
      const newFreelancingInfo = new FreelancingInfo({
        uid,
        skills: skills || [],
        services: services || [],
        platform_integrations: platform_integrations || []
      });
      
      await newFreelancingInfo.save();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Freelancing information saved successfully' 
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error saving freelancing information:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to save freelancing information' 
    }, { status: 500 });
  }
}