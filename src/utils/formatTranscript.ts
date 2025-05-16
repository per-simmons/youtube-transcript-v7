// Define the transcript response type based on the library
export interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
  lang?: string;
}

/**
 * Format transcript segments for display with timestamps
 */
export function formatTranscriptForDisplay(transcript: TranscriptSegment[]): string {
  return transcript.map((segment) => {
    const time = formatTimestamp(segment.offset);
    return `[${time}] ${segment.text}`;
  }).join('\n');
}

/**
 * Format transcript segments for download as plain text
 */
export function formatTranscriptForDownload(transcript: TranscriptSegment[]): string {
  return transcript.map((segment) => {
    const time = formatTimestamp(segment.offset);
    return `[${time}] ${segment.text}`;
  }).join('\n');
}

/**
 * Format seconds as HH:MM:SS
 */
export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
} 