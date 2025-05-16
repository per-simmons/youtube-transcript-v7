export class YoutubeTranscriptTooManyRequestError extends Error {
  constructor() {
    super(
      'YouTube is receiving too many requests from your IP address. Please try again later or use a proxy. If the issue persists, consider reducing the frequency of requests.',
    );
    this.name = 'YoutubeTranscriptTooManyRequestError';
  }
}

export class YoutubeTranscriptVideoUnavailableError extends Error {
  constructor(videoId: string) {
    super(
      `The video with ID "${videoId}" is no longer available or has been removed. Please check the video URL or ID and try again.`,
    );
    this.name = 'YoutubeTranscriptVideoUnavailableError';
  }
}

export class YoutubeTranscriptDisabledError extends Error {
  constructor(videoId: string) {
    super(
      `Transcripts are disabled for the video with ID "${videoId}". This may be due to the video owner disabling captions or the video not supporting transcripts.`,
    );
    this.name = 'YoutubeTranscriptDisabledError';
  }
}

export class YoutubeTranscriptNotAvailableError extends Error {
  constructor(videoId: string) {
    super(
      `No transcripts are available for the video with ID "${videoId}". This may be because the video does not have captions or the captions are not accessible.`,
    );
    this.name = 'YoutubeTranscriptNotAvailableError';
  }
}

export class YoutubeTranscriptNotAvailableLanguageError extends Error {
  constructor(lang: string, availableLangs: string[], videoId: string) {
    super(
      `No transcripts are available in "${lang}" for the video with ID "${videoId}". Available languages: ${availableLangs.join(
        ', ',
      )}. Please try a different language.`,
    );
    this.name = 'YoutubeTranscriptNotAvailableLanguageError';
  }
}

export class YoutubeTranscriptInvalidVideoIdError extends Error {
  constructor() {
    super(
      'Invalid YouTube video ID or URL. Please provide a valid video ID or URL. Example: "dQw4w9WgXcQ" or "https://www.youtube.com/watch?v=dQw4w9WgXcQ".',
    );
    this.name = 'YoutubeTranscriptInvalidVideoIdError';
  }
}
