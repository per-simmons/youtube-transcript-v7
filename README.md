# YouTube Transcript Downloader

A web application that allows you to extract and download transcripts from YouTube videos. Built with Next.js and leveraging the youtube-transcript-plus library for transcript extraction.

## Features

- Extract transcripts from any YouTube video that has captions available
- Display timestamped transcripts in a readable format
- Download transcripts as a text file
- Clean, responsive UI built with Tailwind CSS
- Comprehensive error handling for various failure scenarios

## Tech Stack

- **Frontend**: Next.js with App Router, React, Tailwind CSS
- **Backend**: Next.js API Routes with Node.js runtime
- **Transcript Extraction**: youtube-transcript-plus library

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/youtube-transcript-downloader.git
   cd youtube-transcript-downloader
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

This application is fully compatible with Vercel and can be deployed without any additional configuration:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Deploy

## How to Use

1. Enter a valid YouTube URL in the input field
2. Click "Get Transcript" to fetch the transcript
3. View the transcript with timestamps
4. Click "Download as TXT" to save the transcript to your device

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [youtube-transcript-plus](https://github.com/ericmmartin/youtube-transcript-plus) for the transcript extraction functionality 