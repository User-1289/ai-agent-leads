import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { FreelancingInfoSchema } from "@/lib/schemas/FreelancingInfo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, portfolioUrl, linkedinUrl, resumeUrl, xUrl, githubUrl, uid, skills, services, platform_integrations } = body;

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
      existingInfo.name = name || existingInfo.name;
      existingInfo.title = title || existingInfo.title;
      existingInfo.portfolio_url = portfolioUrl || existingInfo.portfolio_url;
      existingInfo.linkedin_url = linkedinUrl || existingInfo.linkedin_url;
      existingInfo.resume_url = resumeUrl || existingInfo.resume_url;
      existingInfo.x_url = xUrl || existingInfo.x_url;
      existingInfo.github_url = githubUrl || existingInfo.github
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
        name,
        title,
        portfolio_url: portfolioUrl,
        linkedin_url: linkedinUrl,
        resume_url: resumeUrl,
        x_url: xUrl,
        github_url: githubUrl,
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