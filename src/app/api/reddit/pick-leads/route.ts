import { LeadSchema } from "@/lib/schemas/Leads";
import { NextRequest, NextResponse } from "next/server";
import snoowrap from 'snoowrap';
import mongoose from "mongoose";
import OpenAI from "openai";
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { cookies } from "next/headers";
import  AutoIncrementFactory from 'mongoose-sequence';


const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const PostUrlSchema = z.object({
  posts: z.array(
    z.object({
      post_url: z.string(),
      match_reason: z.string()
    })
  ),
});

const freelanceSubs = ["forhire", "hiring", "jobbit", "freelance_forhire", "FreelanceProgramming", "AppDevelopers", "appdev"]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skills = searchParams.get('skills') || '';
  const services = searchParams.get('services') || '';
  const campaign_name = searchParams.get('campaign_name') || 'default';
  const campaign_description = searchParams.get('campaign_description') || '';
  //const uid = searchParams.get('uid')
  const cookieStore = await cookies()
  const uid = cookieStore.get('uid')?.value

  const r = new snoowrap({
    userAgent: 'NODEJS:myapp:v1.0.0 (by /u/armaan-dev)',
    clientId: process.env.REDDIT_APP_ID,
    clientSecret: process.env.REDDIT_APP_SECRET,
    accessToken:cookieStore.get('reddit_access_token')?.value
  })
  //if (!uid) {
  //  return NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
  //}

  //if (!query) {
  //  return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  //}

  //if (!skills || !services) {
  //  return NextResponse.json({ error: 'Missing skills or services parameter' }, { status: 400 });
  //}  

   // console.log(skills);  
   // return NextResponse.json({skills:skills}, {status:200});
      // Connect to MongoDB
      
  try {
    // Perform search in the given subreddit
    //const searchResults = await r.getSubreddit("freelance_forhire").search({
    //  query:`${skills}`,
    //  sort: 'relevance',
    //  limit:50
    //});
    //search from all subreddits on a loop
    const searchResults = [];
    for (const sub of freelanceSubs) {
      const results = await r.getSubreddit(sub).search({
        
        query: `[HIRING] ${skills} ${services}`,
        sort: 'relevance',
      });
     // console.log(results);
      searchResults.push(...results);
    }

   // console.log(searchResults);
    // Format results
    const results = searchResults.map(post => ({
      title: post.title,
      score: post.score,
      url: post.url,
      author: post.author.name,
      created_utc: new Date(post.created_utc * 1000).toISOString(),
      subreddit: post.subreddit,
      body:post.selftext || '[No body content]',
      platform: 'reddit',
      match_reason: "null"
    }));



    // Sort posts by date (newest first)
    results.sort((a, b) => {
      const dateA = new Date(a.created_utc).getTime();
      const dateB = new Date(b.created_utc).getTime();
      return dateB - dateA;
    });

    // return NextResponse.json({results}, {status: 200}); 

    const openaiArr = results.map((result) => ({
      title: result.title,
      url: result.url,
      //body: result.body,
    }))

    let jsonMatch:any;
    try {
      let response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for picking the posts which match my skills. Only select URLs that are explicitly provided to you. Do not generate or hallucinate any URLs that are not in the list."
          },
          {
            role: "user",
            content: `Here are the skills I have: ${skills}. Here are the services I provide: ${services}. Only pick the posts which are [HIRING] and not [FOR HIRE]. Return ONLY URLs that are present in the list I provide you.`
          },
          {
            role: 'user',
            content: `Here are the posts I found: ${JSON.stringify(openaiArr)}. 
            IMPORTANT: Only select URLs from this exact list. Do not hallucinate or create any URLs that are not in this list.
            For each match, provide a brief reason why this post matches my skills.`
          }
        ],
        response_format: zodResponseFormat(PostUrlSchema, 'PostUrlSchema'),
        temperature: 0.1, // Lower temperature for more deterministic outputs
      });
      jsonMatch = response.choices[0].message.content;
    
      // 3. Add validation step to ensure URLs exist in the original array
      const parsedMatch = JSON.parse(jsonMatch);
      const validPosts = parsedMatch.posts.filter((post:any) => {
        // Check if this URL exists in the original results
        return results.some(result => result.url === post.post_url);
      });
      
      // Replace posts with only the valid posts
      parsedMatch.posts = validPosts;
      jsonMatch = JSON.stringify(parsedMatch);
    
      console.log("Validated matches:", parsedMatch);
    
    } catch (error) {
      console.error('Error at openai api', error);
      return NextResponse.json({ error: 'Failed at openai api' }, { status: 500 });
    }

    //loop through the results and take one element and loop through the jsonMatch and check if the post_url matches, if it does then add the match index to finalResults
    const parsedMatch = JSON.parse(jsonMatch);
    
    const finalResults:any = [];
    JSON.parse(jsonMatch).posts.forEach((post:any) => {
      results.forEach((result:any) => {
        if (result.url === post.post_url) {
          finalResults.push({...result, match_reason: post.match_reason});
        }
      });
    });

    //return NextResponse.json({message: "Leads saved successfully", leads: JSON.parse(jsonMatch)}, {status: 200});
    //return NextResponse.json({ results: finalResults }, { status: 200 });

    //save the finalResults to the database
    const campaign_id = Math.floor(Math.random() * 1000000);
    const LeadModel = mongoose.models.Campaign || mongoose.model("Campaign", LeadSchema);
        try {
      const newLead = new LeadModel({
        uid:uid,
        campaign_name:campaign_name,
        campaign_id:campaign_id,
        campaign_description:campaign_description,
        skills_selected:skills,
        services_selected:services,
        potential_leads:finalResults.map((lead:any) => ({
          post_url: lead.url,
          post_author: lead.author,
          post_title: lead.title,
          post_body: lead.body,
          post_score: lead.score,
          post_created_utc: lead.created_utc,
          post_subreddit: lead.subreddit.display_name,
          platform: "reddit",
          match_reason: lead.match_reason
        })),
      })
      await newLead.save();
      console.log("Leads saved successfully", finalResults);
      return NextResponse.json({ message: "Leads saved successfully", leads: finalResults, skills:skills, services:services }, { status: 200 });
    } catch (error) {
      console.error('Error saving leads:', error);
      return NextResponse.json({ error: 'Failed to save leads', errorMsg:error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch search results',  }, { status: 500 });
  }
}