import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  // With Google Sheets auth, callback is not needed
  // Redirect to login page
  return NextResponse.redirect(`${origin}/login`);
}
