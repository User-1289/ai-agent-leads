export function removeDuplicatesByPostUrl(parsedMatch:any) {
    // Check if parsedMatch has a posts property and it's an array
    if (!parsedMatch || !parsedMatch.posts || !Array.isArray(parsedMatch.posts)) {
      return []; // Return empty array if structure is not as expected
    }
  
    // Create a Set to track unique post_urls
    const uniquePostUrls = new Set();
    
    // Filter the posts array to keep only posts with unique post_url
    const uniquePosts = parsedMatch.posts.filter((post:any) => {
      // Skip if post is not an object or doesn't have post_url
      if (!post || typeof post !== 'object' || !post.post_url) {
        return true; // Keep posts without post_url
      }
      
      // Check if we've seen this post_url before
      if (uniquePostUrls.has(post.post_url)) {
        return false; // Skip this post (duplicate)
      } else {
        uniquePostUrls.add(post.post_url); // Add to our set of seen URLs
        return true; // Keep this post (unique)
      }
    });
    
    // Return just the uniquePosts array
    return uniquePosts;
  }