// test-transcript.js
const { YoutubeTranscript } = require('youtube-transcript-plus');

// Test URL - use a video that definitely has transcripts
const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up

async function testTranscript() {
  try {
    console.log(`Testing transcript retrieval for ${testUrl}`);
    
    // Try with a different, more modern user agent
    const customUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';
    
    const transcript = await YoutubeTranscript.fetchTranscript(testUrl, {
      userAgent: customUserAgent
    });
    
    console.log(`Success! Retrieved transcript with ${transcript.length} segments`);
    console.log('First few segments:');
    console.log(transcript.slice(0, 3));
  } catch (error) {
    console.error('Error fetching transcript:');
    console.error(`Error name: ${error.name}`);
    console.error(`Error message: ${error.message}`);
    console.error(error.stack);
  }
}

testTranscript();
