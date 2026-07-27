import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { planId, amount, matchmakersCount } = await request.json();

    if (!planId || !amount) {
      return NextResponse.json({ error: 'Missing planId or amount' }, { status: 400 });
    }

    // Generate a mock Stripe Checkout session ID
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    const mockCheckoutUrl = `https://checkout.stripe.com/pay/${mockSessionId}?plan=${planId}&amount=${amount}&users=${matchmakersCount || 1}`;

    return NextResponse.json({ 
      success: true, 
      sessionId: mockSessionId, 
      url: mockCheckoutUrl 
    });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
