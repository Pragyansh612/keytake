// app/api/auth/clear-cookie/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear the auth cookie
    response.cookies.delete('access_token');
    
    return response;
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
    return NextResponse.json(
      { error: 'Failed to clear authentication cookie' }, 
      { status: 500 }
    );
  }
}