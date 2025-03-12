import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import snoowrap from 'snoowrap';


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const reddit_username = searchParams.get('reddit_username');
    const msg = searchParams.get('msg');

    if (!reddit_username || !msg) {
        return NextResponse.json({ error: 'Missing reddit_username or msg parameter' }, { status: 400 });
    }

    const cookieStore = await cookies()
    const accessToken = cookieStore.get('reddit_access_token')?.value
    console.log(accessToken)

    let r:snoowrap;
    try {
        r = new snoowrap({
            userAgent: 'NODEJS:myapp:v1.0.0 (by /u/armaan-dev)',
            clientId: process.env.REDDIT_APP_ID,
            clientSecret: process.env.REDDIT_APP_SECRET,
            accessToken: accessToken,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD
        });
    }catch(error){
        console.error('Error Authenticating:', error);
        return NextResponse.json({ error: 'Error Authenticating', errorMsg:error }, { status: 500 });
    }

    try {
        // Send private message to the specified user
        await r.composeMessage({
            to: reddit_username,
            subject: 'Hello from FrankLeads',
            text: msg,
        });
        return NextResponse.json({ message: 'Chat message sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending chat message:', error);
        return NextResponse.json({ error: 'Error sending chat message', errorMsg: error }, { status: 500 });
    }
      
}

