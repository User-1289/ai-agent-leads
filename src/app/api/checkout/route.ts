import { NextResponse,  NextRequest } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil'
});

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      //success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      //cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      success_url:`${request.nextUrl.origin}/dashboard`,
      cancel_url: `${request.nextUrl.origin}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}