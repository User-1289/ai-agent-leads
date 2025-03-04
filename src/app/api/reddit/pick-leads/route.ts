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
  accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzQxMTY3NDQ2LjQ2MTg5LCJpYXQiOjE3NDEwODEwNDYuNDYxODksImp0aSI6IjVCTnFHSzUyT0ZEaG1sdmdqN1VUeXBnZXppZTJ5QSIsImNpZCI6IkxYQlhRcHY0VlRxSjFnbEJ2azIzZHciLCJsaWQiOiJ0Ml9yMGR1cm13Y3EiLCJhaWQiOiJ0Ml9yMGR1cm13Y3EiLCJsY2EiOjE3MDM5MTY5NTEyMTUsInNjcCI6ImVKeUtWaXBLVFV4UmlnVUVBQURfX3d2RUFwayIsInJjaWQiOiJPWldqVlBtaEpVMVlIRkE0ckRxTERIb0JOTlp4bVlUVGpBV0xZTjhHTkNZIiwiZmxvIjo4fQ.TmB1JlL6Iv8iP6yPwEV5HIKnquZIkYUH-MxGYkS5-5jaVL_Zu64xyyahBPqd-wPzN9EDGfVRkGqW09RHLYMPwwDrq8u_lKDtjSRhFQSraV9xa9lXlvCDxlYwPIfQhaoawlFrOcL74yEb9N7XH1yCSfTEAjlY12G7dBIKuDMEd3iZNGc4ST6vOvvzI1EKBick6yiSItvusayxCtZSP14ofKVKpk3wVpdaGPOdatOx9F3N1KI5DrrFmFAp3PFa7bvbk8mpzIzmSClNLezPTI-dMW4C_LVjDglXZ1I5uj3_51E2BENCHjAcGd09aLvBv5gR8K7JXZCrv8CJWMvd8ZXVsA",
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

      // Connect to MongoDB
      if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
      }
      
  try {
    // Perform search in the given subreddit
    const searchResults = await r.getSubreddit("freelance_forhire").search({
      query:`flair:"Hiring" ${skills}`,
      sort: 'relevance',
      limit:50
    });

    // Format results
    const results = searchResults.map(post => ({
      title: post.title,
      score: post.score,
      url: post.url,
      author: post.author.name,
      created_utc: new Date(post.created_utc * 1000).toISOString(),
      body:post.selftext || '[No body content]',
      platform: 'reddit',
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

    //loop through the results and take one element and loop through the jsonMatch and check if the post_url matches, if it does then add the match index to finalResults
    const finalResults:any = [];
    results.forEach((result) => {
      JSON.parse(jsonMatch).posts.forEach((post:any) => {
        if (result.url === post.post_url) {
          finalResults.push(result);
        }
      });
    });

    //return NextResponse.json({message: "Leads saved successfully", leads: JSON.parse(jsonMatch)}, {status: 200});
    //return NextResponse.json({ results: finalResults }, { status: 200 });

    //save the finalResults to the database
    const LeadModel = mongoose.models.Leads || mongoose.model("Leads", LeadSchema);
    try {
      const newLead = new LeadModel({
        uid:uid,
        potential_leads:finalResults.map((lead:any) => ({
          post_url: lead.url,
          post_author: lead.author,
          post_title: lead.title,
          post_body: lead.body,
          post_score: lead.score,
          post_created_utc: lead.created_utc,
          post_subreddit: "freelance_forhire",
          platform: "reddit",
        })),
      })
      await newLead.save();
      return NextResponse.json({ message: "Leads saved successfully", leads: finalResults }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to save leads', errorMsg:error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}