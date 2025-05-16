# YouTube Transcript Downloader

A web application that allows users to download transcripts from YouTube videos.

## Features

- Extract transcripts from any YouTube video that has captions
- Clean, responsive user interface
- Download transcripts as formatted text files
- Handles various error cases gracefully
- Built with Next.js, React, and TypeScript

## Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Troubleshooting

If you encounter the "Transcripts are disabled for this video" error, try the following:

1. Verify that the video actually has captions/transcripts by checking on YouTube
2. Try using a different YouTube video
3. If the issue persists, it might be related to YouTube's API changes or rate limiting

## Testing

You can test the transcript extraction functionality using the included test script:

```
node test-transcript.js
```

## Technical Details

- Built with Next.js 15.3.2 and React 19
- Uses the youtube-transcript-plus library for transcript extraction
- Styled with Tailwind CSS 4.0
- TypeScript for type safety
- Deployed on Vercel
