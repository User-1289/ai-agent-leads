import mongoose, { Schema } from "mongoose";

/*const LeadSchema = new Schema({
    uid: {
        type:String,
        required:true,
        ref:'users'
    },
    post_url:{
        type:String,
    },
    post_author:String,
    post_title:String,
    post_body:String,
    post_score:Number,
    post_created_utc:String,
    post_subreddit:String,
    platform:String,
})*/

const LeadSchema = new Schema({
    uid:{
        type:String,
        unique:true,
        required:true,
    },
    potential_leads:[{
        post_url:{
            type:String,
        },
        post_author:String,
        post_title:String,
        post_body:String,
        post_score:Number,
        post_created_utc:String,
        post_subreddit:String,
        platform:String,
    }]
})

export { LeadSchema };