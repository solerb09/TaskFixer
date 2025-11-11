import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')

  // Redirect to homepage with the status
  const redirectUrl = new URL('/', request.url)

  if (status === 'canceled') {
    redirectUrl.searchParams.set('canceled', 'true')
  } else if (status === 'success') {
    redirectUrl.searchParams.set('success', 'true')
  }

  return NextResponse.redirect(redirectUrl, { status: 303 })
}
