'use client';

import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface TranscriptFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export default function TranscriptForm({ onSubmit, isLoading }: TranscriptFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [debugResponse, setDebugResponse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }
    
    if (!youtubeRegex.test(url)) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    setError('');
    onSubmit(url);
  };

  // Test the main transcript API (POST)
  const testTranscriptApi = async () => {
    try {
      setDebugResponse('Testing transcript API endpoint...');
      console.log('Testing transcript API endpoint (POST)');
      
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }),
      });
      
      console.log(`Transcript API test response status: ${response.status}`);
      
      const text = await response.text();
      console.log('Transcript API test response body:', text);
      
      setDebugResponse(`Transcript API POST test: Status ${response.status}. Response: ${text}`);
    } catch (err) {
      console.error('Transcript API test error:', err);
      setDebugResponse(`Transcript API test error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Test the main transcript API (GET)
  const testTranscriptApiGet = async () => {
    try {
      setDebugResponse('Testing transcript API endpoint (GET)...');
      console.log('Testing transcript API endpoint (GET)');
      
      const response = await fetch('/api/transcript');
      
      console.log(`Transcript API GET test response status: ${response.status}`);
      
      const text = await response.text();
      console.log('Transcript API GET test response body:', text);
      
      setDebugResponse(`Transcript API GET test: Status ${response.status}. Response: ${text}`);
    } catch (err) {
      console.error('Transcript API GET test error:', err);
      setDebugResponse(`Transcript API GET test error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Test the new test API endpoint
  const testTestApi = async () => {
    try {
      setDebugResponse('Testing test API endpoint...');
      console.log('Testing test API endpoint');
      
      const response = await fetch('/api/test');
      
      console.log(`Test API response status: ${response.status}`);
      
      const text = await response.text();
      console.log('Test API response body:', text);
      
      setDebugResponse(`Test API endpoint: Status ${response.status}. Response: ${text}`);
    } catch (err) {
      console.error('Test API error:', err);
      setDebugResponse(`Test API error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Enter YouTube Video URL</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-1">
            YouTube URL
          </label>
          <input
            id="youtube-url"
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            disabled={isLoading}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="small" />
              <span className="ml-2">Fetching Transcript...</span>
            </div>
          ) : (
            'Get Transcript'
          )}
        </button>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setDebugMode(!debugMode)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {debugMode ? 'Hide Debug' : 'Debug Mode'}
          </button>
        </div>

        {debugMode && (
          <div className="mt-4 p-3 border border-gray-300 rounded-md bg-gray-50">
            <h3 className="font-medium mb-2">API Testing Tools</h3>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={testTranscriptApi}
                  className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  Test Transcript API (POST)
                </button>
                <button
                  type="button"
                  onClick={testTranscriptApiGet}
                  className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  Test Transcript API (GET)
                </button>
                <button
                  type="button"
                  onClick={testTestApi}
                  className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  Test /api/test Endpoint
                </button>
              </div>
              {debugResponse && (
                <div className="text-xs mt-2 p-2 bg-white border border-gray-200 rounded max-h-40 overflow-auto">
                  <pre>{debugResponse}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 