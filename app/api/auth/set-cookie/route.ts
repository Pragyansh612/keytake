// app/api/auth/set-cookie/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' }, 
        { status: 400 }
      );
    }
    
    const response = NextResponse.json({ success: true });
    
    // Set httpOnly cookie for security
    response.cookies.set('access_token', accessToken, {
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: '/', // Available on all routes
    });
    
    return response;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return NextResponse.json(
      { error: 'Failed to set authentication cookie' }, 
      { status: 500 }
    );
  }
}

