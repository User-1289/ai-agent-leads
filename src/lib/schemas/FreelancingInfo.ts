import mongoose, { Schema } from "mongoose";
import { title } from "process";
interface Skill {
    name: string;
    proficiency: string;
}

const FreelancingInfoSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    ref: 'users' // Reference to User collection
  },
  name:{
    type:String,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  portfolio_url:String,
  resume_url:String,
  linkedin_url:String,
  github_url:String,
  x_url:String,
  skills: {
    type: [String],
    default: []
  },
  services: {
    type: [String],
    default: []
  },
  platform_integrations: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
FreelancingInfoSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export { FreelancingInfoSchema };