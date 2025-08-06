import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get token from cookies or headers
  const token = request.cookies.get('access_token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  console.log('Middleware - Path:', request.nextUrl.pathname, 'Has Token:', !!token);

  // Check if user is authenticated by checking for token
  const isAuthenticated = !!token;

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    console.log('User is authenticated, redirecting to dashboard');
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and trying to access protected pages, redirect to login
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('User not authenticated, redirecting to login');
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}