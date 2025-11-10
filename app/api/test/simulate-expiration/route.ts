import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, action } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Get current user data
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'expire') {
      // Set subscription_ends_at to 1 minute ago to simulate expiration
      const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()

      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          subscription_ends_at: oneMinuteAgo,
        })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({
        success: true,
        message: 'Subscription end date set to 1 minute ago (expired)',
        subscription_ends_at: oneMinuteAgo,
        originalEndDate: user.subscription_ends_at,
      })
    } else if (action === 'restore') {
      // Set subscription_ends_at back to 30 days from now (simulating active subscription)
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          subscription_ends_at: thirtyDaysFromNow,
          subscription_status: 'active',
        })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({
        success: true,
        message: 'Subscription restored to active (30 days from now)',
        subscription_ends_at: thirtyDaysFromNow,
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "expire" or "restore"' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error simulating expiration:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to simulate expiration' },
      { status: 500 }
    )
  }
}

// GET endpoint to check current subscription status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('subscription_tier, subscription_status, subscription_ends_at, billing_interval')
      .eq('id', userId)
      .single()

    if (fetchError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const now = new Date()
    const endsAt = user.subscription_ends_at ? new Date(user.subscription_ends_at) : null
    const isExpired = endsAt ? now > endsAt : false

    return NextResponse.json({
      user: {
        subscription_tier: user.subscription_tier,
        subscription_status: user.subscription_status,
        subscription_ends_at: user.subscription_ends_at,
        billing_interval: user.billing_interval,
      },
      check: {
        now: now.toISOString(),
        endsAt: endsAt?.toISOString() || null,
        isExpired,
        timeUntilExpiration: endsAt
          ? Math.round((endsAt.getTime() - now.getTime()) / 1000)
          : null,
      },
    })
  } catch (error: any) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check subscription' },
      { status: 500 }
    )
  }
}
