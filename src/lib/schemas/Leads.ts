import mongoose, { Schema } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

// Function to apply auto-increment (without direct connection)
export const LeadSchema = new Schema({
    uid: {
        type: String,
        required: true,
    },
    campaign_name: {
        type: String,
        required: true,
    },
    campaign_description: String,
    campaign_id: {
        type: Number,
        unique: true,
    },
    potential_leads: [{
        post_url: {
            type: String,
            unique: true,
        },
        post_author: String,
        post_title: String,
        post_body: String,
        post_score: Number,
        post_created_utc: String,
        post_subreddit: String,
        platform: String,
        match_reason: String,
    }]
});

const createLeadSchema = (connection:any) => {
    const AutoIncrement = AutoIncrementFactory(connection);



    // Apply Auto-Increment
    LeadSchema.plugin(AutoIncrement, { inc_field: "campaign_id" });

    return mongoose.models.Campaign || mongoose.model("Campaign", LeadSchema);
};

// Export function instead of schema directly
export default createLeadSchema;