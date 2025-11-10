import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, organization, phone, message } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('sales_inquiries')
      .insert({
        name,
        email,
        organization: organization || null,
        phone: phone || null,
        message: message || null,
        status: 'new',
      })

    if (error) {
      console.error('Error saving sales inquiry:', error)
      return NextResponse.json(
        { error: 'Failed to save inquiry' },
        { status: 500 }
      )
    }

    // TODO: Optionally send notification email to sales team

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Error in contact-sales API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
