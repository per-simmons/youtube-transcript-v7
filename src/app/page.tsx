'use client';

import React, { useState } from 'react';
import TranscriptForm from '@/components/TranscriptForm';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import { TranscriptSegment } from '@/utils/formatTranscript';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setTranscript([]);
    setVideoUrl(url);

    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setTranscript(data.transcript);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">YouTube Transcript Downloader</h1>
        <p className="text-gray-600">Extract and download transcripts from any YouTube video</p>
      </header>

      <TranscriptForm onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <div className="w-full max-w-2xl mx-auto mt-8 bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {transcript.length > 0 && <TranscriptDisplay transcript={transcript} videoUrl={videoUrl} />}
    </div>
  );
} 