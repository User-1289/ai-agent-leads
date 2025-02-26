import { LeadSchema } from "@/lib/schemas/Leads";
import { NextRequest, NextResponse } from "next/server";
import snoowrap from 'snoowrap';
import mongoose from "mongoose";
const freelanceSubs = ["freelance_forhire", "freelance", "FreelanceProgramming", "freelanceWriters"]

const r = new snoowrap({
  userAgent: 'NODEJS:myapp:v1.0.0 (by /u/armaan-dev)',
  clientId: process.env.REDDIT_APP_ID,
  clientSecret: process.env.REDDIT_APP_SECRET,
  accessToken: process.env.REDDIT_ACCESS_TOKEN,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); 
  const limit = Number(searchParams.get('limit')) || 5; 
  const skills = searchParams.get('skills') || '';
  
  let skillsArr = skills.split(' ');

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

      // Connect to MongoDB
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
      }
      
  try {
    // Perform search in the given subreddit
    const searchResults = await r.getSubreddit("freelance_forhire").search({
      query:`flair:"Hiring" ${skills}`,
      limit,
      sort: 'relevance',
      
    });

    // Format results
    const results = searchResults.map(post => ({
      title: post.title,
      score: post.score,
      url: post.url,
      author: post.author.name,
      created_utc: new Date(post.created_utc * 1000).toISOString(),
      body:post.selftext || '[No body content]',
    }));

    //sort them based on the date'
    results.sort(function(a,b){
      return new Date(b.created_utc) - new Date(a.created_utc);
    })

    //saving leads to the database

    const LeadModel = mongoose.models.Leads || mongoose.model("Leads", LeadSchema);
    results.forEach(async (lead) => {
        const newLead = new LeadModel({
            uid: "12",
            post_url: lead.url,
            post_author: lead.author,
            post_title: lead.title,
            post_body: lead.body,
            post_score: lead.score,
            post_created_utc: lead.created_utc,
            post_subreddit: "freelance_forhire"
        });
        await newLead.save();
        });

    return NextResponse.json({message: "Leads saved successfully", leads: results}, {status: 200});
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}