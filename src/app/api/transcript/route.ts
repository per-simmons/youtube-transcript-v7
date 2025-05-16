import { NextRequest, NextResponse } from 'next/server';

// Explicitly set the runtime to Node.js instead of Edge
export const runtime = 'nodejs';

// Constants copied directly from the library
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';
const RE_YOUTUBE = /(?:v=|\/|v\/|embed\/|watch\?.*v=|youtu\.be\/|\/v\/|e\/|watch\?.*vi?=|\/embed\/|\/v\/|vi?\/|watch\?.*vi?=|youtu\.be\/|\/vi?\/|\/e\/)([a-zA-Z0-9_-]{11})/i;
const RE_XML_TRANSCRIPT = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;

// Extract video ID from URL
function retrieveVideoId(videoId: string): string {
  if (videoId.length === 11) {
    return videoId;
  }
  const matchId = videoId.match(RE_YOUTUBE);
  if (matchId && matchId.length) {
    return matchId[1];
  }
  throw new Error('Invalid YouTube video ID or URL. Please provide a valid video ID or URL.');
}

// Custom fetch with user agent
async function customFetch(url: string, userAgent: string, lang?: string): Promise<Response> {
  console.log(`Fetching URL: ${url}`);
  return fetch(url, {
    headers: {
      ...(lang && { 'Accept-Language': lang }),
      'User-Agent': userAgent,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }
    
    console.log(`Processing URL: ${url}`);
    
    // Core functionality directly implemented
    try {
      const videoId = retrieveVideoId(url);
      console.log(`Extracted video ID: ${videoId}`);
      
      // 1. Fetch the video page
      const videoPageResponse = await customFetch(
        `https://www.youtube.com/watch?v=${videoId}`,
        DEFAULT_USER_AGENT
      );
      
      console.log(`Video page status: ${videoPageResponse.status}`);
      
      if (!videoPageResponse.ok) {
        throw new Error(`Video is unavailable: ${videoId}`);
      }
      
      const videoPageBody = await videoPageResponse.text();
      console.log(`Video page size: ${videoPageBody.length} bytes`);
      
      // 2. Parse for captions
      const splittedHTML = videoPageBody.split('"captions":');
      
      if (splittedHTML.length <= 1) {
        if (videoPageBody.includes('class="g-recaptcha"')) {
          throw new Error('YouTube is receiving too many requests from your IP address.');
        }
        if (!videoPageBody.includes('"playabilityStatus":')) {
          throw new Error(`Video is unavailable: ${videoId}`);
        }
        throw new Error(`Transcripts are disabled for the video with ID "${videoId}".`);
      }
      
      // Parse captions data
      const captionsData = (() => {
        try {
          return JSON.parse(splittedHTML[1].split(',"videoDetails')[0].replace('\n', ''));
        } catch (e) {
          console.error('Error parsing captions data:', e);
          return undefined;
        }
      })();
      
      console.log('Captions data parsed:', captionsData ? 'Yes' : 'No');
      
      const captions = captionsData?.['playerCaptionsTracklistRenderer'];
      
      if (!captions) {
        throw new Error(`Transcripts are disabled for the video with ID "${videoId}".`);
      }
      
      if (!('captionTracks' in captions)) {
        throw new Error(`No transcripts are available for the video with ID "${videoId}".`);
      }
      
      // 3. Get the first caption track
      const captionTrack = captions.captionTracks[0];
      console.log(`Using caption track: ${captionTrack.languageCode}`);
      
      // 4. Fetch the transcript
      const transcriptResponse = await customFetch(
        captionTrack.baseUrl,
        DEFAULT_USER_AGENT
      );
      
      console.log(`Transcript response status: ${transcriptResponse.status}`);
      
      if (!transcriptResponse.ok) {
        throw new Error(`No transcripts are available for the video with ID "${videoId}".`);
      }
      
      const transcriptBody = await transcriptResponse.text();
      console.log(`Transcript size: ${transcriptBody.length} bytes`);
      
      // 5. Parse the transcript
      const results = [...transcriptBody.matchAll(RE_XML_TRANSCRIPT)];
      console.log(`Parsed ${results.length} transcript segments`);
      
      const transcript = results.map((result) => ({
        text: result[3],
        duration: parseFloat(result[2]),
        offset: parseFloat(result[1]),
        lang: captionTrack.languageCode,
      }));
      
      return NextResponse.json({ transcript });
    } catch (error) {
      throw error; // Re-throw to be caught by the outer catch
    }
  } catch (error) {
    console.error('Error fetching transcript:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error(`Error name: ${error.name}, Message: ${error.message}`);
      console.error(`Stack trace: ${error.stack}`);
      
      if (error.message.includes('Video is unavailable')) {
        return NextResponse.json(
          { error: 'Video is unavailable or has been removed' },
          { status: 404 }
        );
      } else if (error.message.includes('Transcripts are disabled')) {
        // Try to extract more information about why transcripts might be disabled
        return NextResponse.json(
          { 
            error: 'Transcripts are disabled for this video',
            details: error.message
          },
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
      } else if (error.message.includes('receiving too many requests')) {
        return NextResponse.json(
          { error: 'YouTube is rate limiting requests. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch transcript', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}