import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { Database } from '@/types/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
})

export async function POST() {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's subscription info
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('stripe_subscription_id, stripe_customer_id, subscription_tier')
      .eq('id', user.id)
      .single<Pick<Database['public']['Tables']['users']['Row'], 'stripe_subscription_id' | 'stripe_customer_id' | 'subscription_tier'>>()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check if user has an active subscription
    if (!profile.stripe_subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Cancel subscription at period end (so user keeps access until billing period ends)
    const subscription = await stripe.subscriptions.update(
      profile.stripe_subscription_id,
      {
        cancel_at_period_end: true,
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
      cancelAt: subscription.cancel_at || null,
      currentPeriodEnd: (subscription as any).current_period_end || null,
    })
  } catch (error: any) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}
