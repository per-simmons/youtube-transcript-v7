import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import { load } from 'cheerio';

// Traditional API route (Pages Router)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Respond to preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Extract video ID from YouTube URL
    const videoId = extractYouTubeVideoId(url);
    
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Fetch transcript using direct method (without third-party library)
    const transcript = await fetchTranscriptDirectly(videoId);
    
    return res.status(200).json(transcript);
  } catch (error) {
    console.error('Error in transcript API:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch transcript', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}

// Helper function to extract video ID from various YouTube URL formats
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// Function to fetch transcript directly from YouTube without using the 's' flag
async function fetchTranscriptDirectly(videoId: string) {
  try {
    // First, fetch the video page to get the caption track
    const videoResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const videoHtml = await videoResponse.text();
    
    // Look for caption data in the page source without using the 's' flag
    // Find the captionTracks section
    const captionTracksIndex = videoHtml.indexOf('"captionTracks"');
    if (captionTracksIndex === -1) {
      return { error: 'No caption tracks found for this video' };
    }
    
    // Extract a reasonable chunk of text after finding captionTracks
    const relevantSection = videoHtml.substring(captionTracksIndex, captionTracksIndex + 3000);
    
    // Find the first baseUrl in that section
    const baseUrlMatch = relevantSection.match(/"baseUrl":\s*"([^"]+)"/);
    if (!baseUrlMatch || !baseUrlMatch[1]) {
      return { error: 'No caption URL found for this video' };
    }
    
    // Get the caption URL (decode HTML entities like &amp;)
    let captionUrl = baseUrlMatch[1].replace(/\\u0026/g, '&');
    
    // Add English parameter if not present
    if (!captionUrl.includes('lang=en')) {
      captionUrl = captionUrl + (captionUrl.includes('?') ? '&' : '?') + 'lang=en';
    }
    
    // Now fetch the actual transcript XML
    const transcriptResponse = await fetch(captionUrl);
    const transcriptXml = await transcriptResponse.text();
    
    // Parse the XML to extract transcript text and timestamps
    const $ = load(transcriptXml, { xmlMode: true });
    
    const transcriptSegments = $('text').map((_, element) => {
      const $element = $(element);
      return {
        text: $element.text(),
        start: parseFloat($element.attr('start') || '0'),
        duration: parseFloat($element.attr('dur') || '0')
      };
    }).get();
    
    if (transcriptSegments.length === 0) {
      return { error: 'Could not parse transcript data' };
    }
    
    return { transcript: transcriptSegments };
  } catch (error) {
    console.error('Error fetching transcript directly:', error);
    throw new Error('Failed to fetch transcript from YouTube');
  }
}