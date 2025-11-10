import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { Database } from '@/types/database'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
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

    // Get user's Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single<{ stripe_customer_id: Database['public']['Tables']['users']['Row']['stripe_customer_id'] }>()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    if (!profile.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      )
    }

    // Create a portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    })

    return NextResponse.json({
      url: session.url,
    })
  } catch (error: any) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
