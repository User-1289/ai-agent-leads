import snoowrap from 'snoowrap';
import { NextRequest, NextResponse } from 'next/server';

const r = new snoowrap({
  userAgent: 'NODEJS:myapp:v1.0.0 (by /u/armaan-dev)',
  clientId: process.env.REDDIT_APP_ID,
  clientSecret: process.env.REDDIT_APP_SECRET,
  accessToken: process.env.REDDIT_ACCESS_TOKEN,
});

export async function GET(request: NextRequest) {
  // Extract search parameters from query string
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // The search term
  const subreddit = searchParams.get('subreddit') || 'all'; // Default to 'all'
  const limit = Number(searchParams.get('limit')) || 5; // Default to 5 results

  if (!query) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    // Perform search in the given subreddit
    const searchResults = await r.getSubreddit(subreddit).search({
      query:`flair:"Hiring" ${query}`,
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

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}