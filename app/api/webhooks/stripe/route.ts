import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Received event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!userId) {
    console.error('No user_id in checkout session metadata')
    return
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const interval = subscription.items.data[0].price.recurring?.interval as 'month' | 'year'

  // Update user profile with subscription
  await supabaseAdmin
    .from('users')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_tier: 'educator',
      subscription_status: 'active',
      billing_interval: interval,
      subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('id', userId)

  console.log(`Subscription activated for user ${userId}`)
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  // Find user by Stripe customer ID
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  const interval = subscription.items.data[0].price.recurring?.interval as 'month' | 'year'
  const status = subscription.status

  let subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'incomplete'
  if (status === 'active') subscriptionStatus = 'active'
  else if (status === 'canceled') subscriptionStatus = 'canceled'
  else if (status === 'past_due') subscriptionStatus = 'past_due'
  else subscriptionStatus = 'incomplete'

  await supabaseAdmin
    .from('users')
    .update({
      stripe_subscription_id: subscription.id,
      subscription_tier: 'educator',
      subscription_status: subscriptionStatus,
      billing_interval: interval,
      subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('id', user.id)

  console.log(`Subscription updated for user ${user.id}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) {
    console.error('User not found for customer:', customerId)
    return
  }

  // Downgrade to free trial
  await supabaseAdmin
    .from('users')
    .update({
      subscription_tier: 'free_trial',
      subscription_status: 'canceled',
      billing_interval: null,
      subscription_ends_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  console.log(`Subscription canceled for user ${user.id}`)
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) return

  // Ensure subscription is active
  await supabaseAdmin
    .from('users')
    .update({
      subscription_status: 'active',
    })
    .eq('id', user.id)

  console.log(`Invoice paid for user ${user.id}`)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!user) return

  // Mark subscription as past_due
  await supabaseAdmin
    .from('users')
    .update({
      subscription_status: 'past_due',
    })
    .eq('id', user.id)

  console.log(`Payment failed for user ${user.id}`)
}
