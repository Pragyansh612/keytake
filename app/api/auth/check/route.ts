// app/api/auth/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpired, getUserFromToken } from '@/middleware';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const cookieToken = request.cookies.get('access_token')?.value;
    
    // Also check Authorization header for localStorage tokens
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    // Prefer cookie token, fallback to header token
    const token = cookieToken || headerToken;
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No token found'
      });
    }
    
    if (isTokenExpired(token)) {
      // Clear expired token cookie
      const response = NextResponse.json({ 
        authenticated: false, 
        expired: true,
        message: 'Token expired'
      });
      response.cookies.delete('access_token');
      return response;
    }
    
    const user = getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Invalid token'
      });
    }

    // If we have a valid header token but no cookie, sync them
    if (headerToken && !cookieToken) {
      const response = NextResponse.json({
        authenticated: true,
        user,
        synced: true
      });
      
      // Set the cookie with the same token
      response.cookies.set('access_token', headerToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
      
      return response;
    }
    
    return NextResponse.json({
      authenticated: true,
      user
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        error: 'Failed to check authentication',
        message: 'Server error'
      },
      { status: 500 }
    );
  }
}

// Optional: Also handle POST requests for explicit auth checks with token sync
export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    
    if (!accessToken) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No token provided'
      });
    }
    
    if (isTokenExpired(accessToken)) {
      return NextResponse.json({ 
        authenticated: false, 
        expired: true,
        message: 'Token expired'
      });
    }
    
    const user = getUserFromToken(accessToken);
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'Invalid token'
      });
    }
    
    // Set the cookie
    const response = NextResponse.json({
      authenticated: true,
      user,
      synced: true
    });
    
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error in auth sync:', error);
    return NextResponse.json(
      { 
        authenticated: false, 
        error: 'Failed to sync authentication',
        message: 'Server error'
      },
      { status: 500 }
    );
  }
}