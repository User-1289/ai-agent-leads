// app/api/reddit-search/route.ts

import { NextRequest, NextResponse } from "next/server";
import snoowrap from "snoowrap";

// GET endpoint that accepts a "query" search parameter
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const limit = Number(searchParams.get("limit"));

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  // Initialize the snoowrap client using environment variables for credentials
  const redditClient = new snoowrap({
    userAgent: 'NODEJS:myapp:v1.0.0 (by /u/armaan-dev)',
    clientId: "LXBXQpv4VTqJ1glBvk23dw",
    clientSecret: "OrbNfv4TGBaxqeAzERkcyPdlBfapcQ",
    accessToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzQxMDI3NjM1LjA3MTQwOCwiaWF0IjoxNzQwOTQxMjM1LjA3MTQwOCwianRpIjoiVE84am5iTVg3ZTctZXJMR0thMUpoWC1mYUNKRmtnIiwiY2lkIjoiTFhCWFFwdjRWVHFKMWdsQnZrMjNkdyIsImxpZCI6InQyX3IwZHVybXdjcSIsImFpZCI6InQyX3IwZHVybXdjcSIsImxjYSI6MTcwMzkxNjk1MTIxNSwic2NwIjoiZUp5S1ZpcEtUVXhSaWdVRUFBRF9fd3ZFQXBrIiwicmNpZCI6IlF2aW0tTHJKaW14TC05aW5rUG5QbXhReGwtb094Vy1UMl9XUlNDcVpRWXciLCJmbG8iOjh9.F2sRo5L7_Y0o1gyliCL_39Pr1AC27CYmwlRFeLShT1EEGerZJqH5cQMNCrJCwNcBq3KgSeEOWdHEZZOfQX4b-ZcBSiC2VkAnY9E53RD3QsbzotOSfGP3CwRPGHWCfGlaPjTtPr9h3GqRt7muWscMzoKt_A8UP5xTAbHo9w_3jTtbZA25lQTXlgmsK2Oviu0cgOgElU6mFmy9hgB0caQ1Vo2dT8B6RK6ONTRBfg1MzfGJPURIKA4jAQmBTHASCQ481lvf9wNtK3Wqw2ZkNcYms4bL8hZlt04sHZZim3ryob3w-I9JEDyxXNqwBydZgGbBs5dpEF9QIDvXX1NYvkmULQ"
  });

  try {
    // Get the target subreddit and perform the search
    const subreddit = redditClient.getSubreddit("freelance_forhire");
    const posts = await subreddit.search({ query: `flair:"Hiring" ${query}`, sort: "new", time: "all", raw_json: 1, limit:limit });
    console.log(posts);
    console.log(typeof posts);
    //dump the posts to a text file
     const fs = require('fs');
     fs.writeFileSync('posts.txt', JSON.stringify(posts, null, 2));
    // Map the posts to the desired format
    const results = posts.map((post) => {
      return {
        uid: post.id,
        post_url: `https://www.reddit.com${post.permalink}`,
        post_author: post.author.name,
        post_title: post.title,
        post_body: post.selftext,
        post_score: post.score,
        post_created_utc: new Date(post.created_utc * 1000).toISOString(),
        post_subreddit: post.subreddit.display_name,
        platform: "reddit",
      };
    });

        //sort them based on the date'
        results.sort(function(a,b){
          return new Date(b.created_utc) - new Date(a.created_utc);
        })
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching reddit posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}