import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/api-reference/:path*']
};

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api-reference')[1];
  return NextResponse.redirect(new URL('https://docs.steamship.com/api' + path));
}
