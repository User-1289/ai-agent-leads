export interface RedditPost {
    post_url: string;
    post_title: string;
    post_author: string;
    post_body: string;
    post_score: number;
    post_created_utc: number;
    post_subreddit: string;
    platform: string;
    match_reason: string;
}

