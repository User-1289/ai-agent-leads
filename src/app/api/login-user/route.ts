import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserSchema } from "@/lib/schemas/UserSchema";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    
    if (!uid) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    
    if (!mongoose.connection.readyState) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }

    try {
        // Update user's signedIn time
        const updatedUser = await User.findOneAndUpdate(
            { uid: uid },
            { signedIn: new Date().toISOString() },
            { new: true }
        );
        
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}