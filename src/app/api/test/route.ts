import { NextResponse } from 'next/server';

// Simple test endpoint
export async function GET() {
  return NextResponse.json({ 
    message: 'Test API is working' 
  });
}
