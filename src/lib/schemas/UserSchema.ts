import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
        uid: {
            type: String,
            required: true,
            unique: true,
            index: true,
            validate: {
                validator: (v: string) => v.length === 28,
                message: "UID must be exactly 28 characters long."
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                message: "Invalid email format."
            }
        },
        name: {
            type: String,
            required: true
        },
        isEmailVerified: {
            type: Boolean,
            required: true
        },
        createdAt: {
            type: String,
            required: true
        },
        signedIn: {
            type: String,
            required: true
        },
        plan:{
            type: String,
            required: true
        }
    });

export {UserSchema}