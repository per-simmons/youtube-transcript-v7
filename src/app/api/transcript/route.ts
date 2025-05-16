import { fetchTranscript } from 'youtube-transcript-plus';
import { NextRequest, NextResponse } from 'next/server';

// Explicitly set the runtime to Node.js instead of Edge
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }
    
    const transcript = await fetchTranscript(url);
    
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    
    // Handle specific errors from the youtube-transcript-plus library
    if (error instanceof Error) {
      if (error.message.includes('Video is unavailable')) {
        return NextResponse.json(
          { error: 'Video is unavailable or has been removed' },
          { status: 404 }
        );
      } else if (error.message.includes('Transcripts are disabled')) {
        return NextResponse.json(
          { error: 'Transcripts are disabled for this video' },
          { status: 404 }
        );
      } else if (error.message.includes('No transcript available')) {
        return NextResponse.json(
          { error: 'No transcript is available for this video' },
          { status: 404 }
        );
      } else if (error.message.includes('not available in the specified language')) {
        return NextResponse.json(
          { error: 'Transcript not available in the specified language' },
          { status: 404 }
        );
      } else if (error.message.includes('Invalid video ID')) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL or video ID' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
} 