import { LeadSchema } from "@/lib/schemas/Leads";
import { NextRequest, NextResponse } from "next/server";
import snoowrap from 'snoowrap';
import mongoose from "mongoose";
import OpenAI from "openai";
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const PostUrlSchema = z.object({
  posts: z.array(
    z.object({
      post_url: z.string()
    })
  ),
});

const freelanceSubs = ["freelance_forhire", "freelance", "FreelanceProgramming", "freelanceWriters"]

const r = new snoowrap({
  userAgent: 'NODEJS:myapp:v1.0.0 (by /u/armaan-dev)',
  clientId: process.env.REDDIT_APP_ID,
  clientSecret: process.env.REDDIT_APP_SECRET,
  accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzQxMDM4MDA3LjEwNzUyNiwiaWF0IjoxNzQwOTUxNjA3LjEwNzUyNiwianRpIjoiZXZfX1hkNVZYR2hYZ0REVWVJZUxZM2ZIZFdncWh3IiwiY2lkIjoiTFhCWFFwdjRWVHFKMWdsQnZrMjNkdyIsImxpZCI6InQyX3IwZHVybXdjcSIsImFpZCI6InQyX3IwZHVybXdjcSIsImxjYSI6MTcwMzkxNjk1MTIxNSwic2NwIjoiZUp5S1ZpcEtUVXhSaWdVRUFBRF9fd3ZFQXBrIiwicmNpZCI6IkFWYVc1VHkydnNwOFF2b1JDZVZ6bzdRYlZVb0dMamU3WURzZlpSN0N4RnMiLCJmbG8iOjh9.kxJkCR8rrDhIx3jQZ32Hedn7nQJLJmmdrCmaM5HOSvGdbg1KkEBHojZhV6WocrqIRw29CiFKkLlCMlm3igd5tki3nR5z9EAmMA48YKmRQL8z5htQgGGTn5PdW5jOn9IZpzNDIse62q4cN5gyPT1_HSdB0jeYsM0Dfq61TiVjE36S6XSZDre36WvDnRvqJHi-vq8Fi52YU-K54YKyM7Ds_8Giw1SGWShseIHH4GA_og40xNWiLfefoPeFJOwlTFt__WrTJNZrj8Q_wcQ__J27PyIXehxtmBkOMwZb242QQ-jGkn8LSR6qelqoh4IJM38NbIYfWhfXDPWNpgRsrJjUFA",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); 
  const limit = Number(searchParams.get('limit')) || 5; 
  const skills = searchParams.get('skills') || '';
  const uid = searchParams.get('uid')

  if (!uid) {
    return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
  }

  //if (!query) {
  //  return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  //}

  if (!skills) {
    return NextResponse.json({ error: 'Missing skills parameter' }, { status: 400 });
  }
  
  
  let skillsArr = skills.split(' ');

      // Connect to MongoDB
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
      }
      
  try {
    // Perform search in the given subreddit
    const searchResults = await r.getSubreddit("freelance_forhire").search({
      query:`flair:"Hiring" ${skills}`,
      sort: 'relevance',
      limit
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

    //const LeadModel = mongoose.models.Leads || mongoose.model("Leads", LeadSchema);
    //results.forEach(async (lead) => {
    //    const newLead = new LeadModel({
    //        uid: uid,
    //        post_url: lead.url,
    //        post_author: lead.author,
    //        post_title: lead.title,
    //        post_body: lead.body,
    //        post_score: lead.score,
    //        post_created_utc: lead.created_utc,
    //        post_subreddit: "freelance_forhire",
    //        platform: "reddit",
    //    });
    //    await newLead.save();
    //    });

    let jsonMatch:any;
    try {
      let response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for picking the posts which match my skills"
          },
          {
            role: "user",
            content: `Here are the skills I have: ${skills}`
          },
          {
            role:'user',
            content:`Here are the posts I found: ${JSON.stringify(results)}`
          }
        ],
        response_format: zodResponseFormat(PostUrlSchema, 'PostUrlSchema'),
      });
      jsonMatch = response.choices[0].message.content

      console.log(JSON.parse(jsonMatch));

    } catch (error) {
      console.error('Error at openai api', error);
      return NextResponse.json({ error: 'Failed at openai api' }, { status: 500 });
    }

    return NextResponse.json({message: "Leads saved successfully", leads: JSON.parse(jsonMatch)}, {status: 200});
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}