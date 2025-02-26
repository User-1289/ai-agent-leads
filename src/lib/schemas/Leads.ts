import mongoose, { Schema } from "mongoose";

const LeadSchema = new Schema({
    uid: {
        type:String,
        required:true,
        ref:'users'
    },
    post_url:String,
    post_author:String,
    post_title:String,
    post_body:String,
    post_score:Number,
    post_created_utc:String,
    post_subreddit:String,
})

export { LeadSchema };