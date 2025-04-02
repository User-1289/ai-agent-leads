import { RedditPost as type } from "@/lib/types/Posts";
import OpenAI from "openai";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
    //verify if uid exists in cookies
    const cookieStore = await cookies();
    let uid = cookieStore.get('uid')?.value;
    const { searchParams } = new URL(request.url);
    
    if(!uid){
        uid = searchParams.get('uid') as string;
    }
    if (!uid) {
        return NextResponse.json({ message:'Unathorized', error:'Mate, why trying to call our api unauthorized' }, { status: 400 });
    }

    let body;
    try {
        body = await request.json();
    } catch (error) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    if (!body) {
        return NextResponse.json({ error: 'Missing body' }, { status: 400 });
    }

    const post = body.post
    const userData = body.userData
    if (!post) {
        return NextResponse.json({ error: 'Missing posts parameter' }, { status: 400 });
    }

    if (!userData) {
        return NextResponse.json({ error: 'Missing userData parameter' }, { status: 400 });
    }

    try {
        const message = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {role:'system', content: 'You are a helpful assistant that creates personalized messages for users to send to potential clients on reddit, that sounds natural and sounds human.'},
                {
                    role: 'user',
                    content:`Create me a personalized message to send to this potential client on reddit in private message.
                    It should be a friendly message that sounds human and natural and should not be like an email with a subject line and a signature.
                    The message should be short and to the point, and should not be too long.
                    Here is the user data: 
                    title: ${userData.title}    
                    name: ${userData.name}
                    Skills: ${userData.skills.join(', ')}
                    Services: ${userData.services.join(', ')}
                    Post Details of the potential client:
                    Here is the post: ${post.post_body}
                    Here is the post title: ${post.post_title}
                    Here is the post author: ${post.post_author}
                    `
                    
                }

            ]
        });
        const messageText = message.choices[0].message.content;
        return NextResponse.json({ personalizedMsg: messageText, message:'successfull' }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Error creating message', error:error }, { status: 500 });``
    }
}