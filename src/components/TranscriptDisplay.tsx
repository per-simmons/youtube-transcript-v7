'use client';

import React, { useState, useEffect } from 'react';
import { TranscriptSegment, formatTranscriptForDisplay, formatTranscriptForDownload } from '@/utils/formatTranscript';

interface TranscriptDisplayProps {
  transcript: TranscriptSegment[];
  videoUrl: string;
}

export default function TranscriptDisplay({ transcript, videoUrl }: TranscriptDisplayProps) {
  const [formattedText, setFormattedText] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  
  useEffect(() => {
    // Format the transcript for display when it changes
    if (transcript && transcript.length > 0) {
      setFormattedText(formatTranscriptForDisplay(transcript));
      
      // Extract video title from URL if possible
      try {
        const url = new URL(videoUrl);
        const videoId = url.searchParams.get('v') || url.pathname.split('/').pop() || '';
        setVideoTitle(`youtube-transcript-${videoId}`);
      } catch (e) {
        setVideoTitle('youtube-transcript');
      }
    }
  }, [transcript, videoUrl]);

  const handleDownload = () => {
    if (!transcript || transcript.length === 0) return;
    
    const content = formatTranscriptForDownload(transcript);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!transcript || transcript.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transcript</h2>
        <button
          onClick={handleDownload}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Download as TXT
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[500px] overflow-y-auto">
        <pre className="whitespace-pre-wrap font-mono text-sm">{formattedText}</pre>
      </div>
    </div>
  );
} 