import mongoose, { Schema } from "mongoose";
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
  skills: {
    type: [{
        name:String,
        level:String
    }],
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