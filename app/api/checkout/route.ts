import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Database } from '@/types/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan, interval } = body

    if (plan !== 'educator' || !['month', 'year'].includes(interval)) {
      return NextResponse.json({ error: 'Invalid plan or interval' }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single<Database['public']['Tables']['users']['Row']>()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Get the correct price ID from environment variables
    const priceId =
      interval === 'month'
        ? process.env.NEXT_PUBLIC_STRIPE_EDUCATOR_MONTHLY_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_EDUCATOR_ANNUAL_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured' },
        { status: 500 }
      )
    }

    // Create or retrieve Stripe customer
    let customerId = profile.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID to database
      await (supabase as any)
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    } else {
      // Verify customer exists in Stripe (handles test/live mode mismatch)
      try {
        await stripe.customers.retrieve(customerId)
      } catch (error: any) {
        if (error.code === 'resource_missing') {
          // Customer doesn't exist, create a new one
          const customer = await stripe.customers.create({
            email: user.email!,
            metadata: {
              supabase_user_id: user.id,
            },
          })
          customerId = customer.id

          // Update database with new customer ID
          await (supabase as any)
            .from('users')
            .update({ stripe_customer_id: customerId })
            .eq('id', user.id)
        } else {
          throw error
        }
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
      metadata: {
        user_id: user.id,
        plan: 'educator',
        interval,
      },
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
