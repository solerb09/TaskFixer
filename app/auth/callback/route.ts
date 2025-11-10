import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Check for redirect cookie set before OAuth redirect
  const cookieStore = await cookies()
  const redirectTo = cookieStore.get('redirect_after_auth')?.value || '/chat'

  // Clear the redirect cookie
  if (cookieStore.has('redirect_after_auth')) {
    cookieStore.delete('redirect_after_auth')
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${redirectTo}`)
}
