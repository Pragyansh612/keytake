import { NextResponse, type NextRequest } from 'next/server'

// Helper function to check if token is expired
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't parse the token, consider it expired/invalid
    return true;
  }
}

// Helper function to extract user data from token
function getUserFromToken(token: string): { id: string; email: string } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub || payload.user_id,
      email: payload.email
    };
  } catch (error) {
    return null;
  }
}

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/notes',
  '/profile',
  '/settings',
  '/study-plans',
  '/flashcards',
  '/quizzes'
];

// Public routes that authenticated users should be redirected from
const authRoutes = ['/login', '/signup'];

// Routes that don't need any middleware processing
const publicRoutes = [
  '/',
  '/about',
  '/pricing',
  '/contact',
  '/privacy',
  '/terms',
  '/forgot-password',
  '/reset-password'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Get token from cookies (httpOnly) first, then fallback to headers for API requests
  let token = request.cookies.get('access_token')?.value;
  
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  console.log('Middleware - Path:', pathname, 'Has Token:', !!token);

  let isAuthenticated = false;
  let user: { id: string; email: string } | null = null;

  // Validate token if present
  if (token) {
    if (isTokenExpired(token)) {
      console.log('Token is expired');
      
      // Create response to clear expired token
      const response = protectedRoutes.some(route => pathname.startsWith(route)) 
        ? NextResponse.redirect(new URL('/login', request.url))
        : NextResponse.next();
      
      // Clear expired token cookie
      response.cookies.delete('access_token');
      
      // Only redirect if trying to access protected routes
      if (protectedRoutes.some(route => pathname.startsWith(route))) {
        return response;
      }
      
      return response;
    } else {
      isAuthenticated = true;
      user = getUserFromToken(token);
      console.log('User authenticated:', user?.email);
    }
  }

  // Handle authenticated users trying to access auth pages
  if (isAuthenticated && authRoutes.includes(pathname)) {
    console.log('Authenticated user accessing auth page, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle unauthenticated users trying to access protected routes
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    console.log('Unauthenticated user accessing protected route, redirecting to login');
    
    // Store the attempted URL to redirect after login
    const loginUrl = new URL('/login', request.url);
    if (pathname !== '/login') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    
    return NextResponse.redirect(loginUrl);
  }

  // Create response and add user context if authenticated
  const response = NextResponse.next();

  // Add user context to headers for server components (optional)
  if (isAuthenticated && user) {
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email);
    response.headers.set('x-authenticated', 'true');
  } else {
    response.headers.set('x-authenticated', 'false');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}

// Export helper functions for use in other parts of the app
export { isTokenExpired, getUserFromToken };