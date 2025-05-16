'use client';

import React, { useState, useEffect } from 'react';
import TranscriptForm from '@/components/TranscriptForm';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import { TranscriptSegment } from '@/utils/formatTranscript';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [deploymentInfo, setDeploymentInfo] = useState('');

  // Get deployment info on load
  useEffect(() => {
    const deployment = window.location.hostname;
    setDeploymentInfo(deployment);
    
    // Test the API endpoint
    fetch('/api/test')
      .then(res => {
        console.log('Test API status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('Test API response:', data);
      })
      .catch(err => {
        console.error('Test API error:', err);
      });
  }, []);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setTranscript([]);
    setVideoUrl(url);

    try {
      console.log(`Sending request to /api/transcript with URL: ${url}`);
      console.log(`Running on deployment: ${deploymentInfo}`);
      
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries([...response.headers.entries()]));
      
      const data = await response.json();
      console.log(`Response data:`, data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setTranscript(data.transcript);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
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
        <p className="text-gray-500 text-sm mt-2">Deployment: {deploymentInfo}</p>
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