'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestApiPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  const runApiTests = async () => {
    setIsLoading(true);
    setResults({});
    
    const testResults: Record<string, any> = {};
    
    // Test 1: App Router GET /api/transcript
    try {
      const response = await fetch('/api/transcript');
      const data = await response.text();
      testResults['appRouter_transcript_get'] = {
        status: response.status,
        ok: response.ok,
        data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
      };
    } catch (error) {
      testResults['appRouter_transcript_get'] = {
        error: true,
        message: error instanceof Error ? error.message : String(error)
      };
    }
    
    // Test 2: App Router POST /api/transcript
    try {
      const response = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      });
      const data = await response.text();
      testResults['appRouter_transcript_post'] = {
        status: response.status,
        ok: response.ok,
        data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
      };
    } catch (error) {
      testResults['appRouter_transcript_post'] = {
        error: true,
        message: error instanceof Error ? error.message : String(error)
      };
    }
    
    // Test 3: Test API endpoint
    try {
      const response = await fetch('/api/test');
      const data = await response.text();
      testResults['appRouter_test_get'] = {
        status: response.status,
        ok: response.ok,
        data
      };
    } catch (error) {
      testResults['appRouter_test_get'] = {
        error: true,
        message: error instanceof Error ? error.message : String(error)
      };
    }
    
    // Test 4: Pages Router API endpoint
    try {
      const response = await fetch('/api/transcript-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
      });
      const data = await response.text();
      testResults['pagesRouter_transcript_post'] = {
        status: response.status,
        ok: response.ok,
        data: data.substring(0, 200) + (data.length > 200 ? '...' : '')
      };
    } catch (error) {
      testResults['pagesRouter_transcript_post'] = {
        error: true,
        message: error instanceof Error ? error.message : String(error)
      };
    }
    
    setResults(testResults);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">API Route Diagnostic Test</h1>
        <p className="text-gray-600 mt-2">This page tests various API routes to diagnose issues</p>
      </header>
      
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
          ← Back to Home
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">API Route Tests</h2>
        <button
          onClick={runApiTests}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Running Tests...' : 'Test API Routes'}
        </button>
        
        {Object.keys(results).length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Test Results:</h3>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      API Route
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(results).map(([key, value]: [string, any]) => (
                    <tr key={key}>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">
                        {key.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {value.error ? (
                          <span className="text-red-600">Error</span>
                        ) : (
                          <span className={value.ok ? 'text-green-600' : 'text-red-600'}>
                            {value.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 break-words">
                        <div className="max-h-40 overflow-y-auto">
                          <pre className="text-xs whitespace-pre-wrap">
                            {value.error ? value.message : value.data}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Interpretation Guide</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold">If App Router Test API works but Transcript API doesn't:</h3>
            <p className="ml-4">- This indicates a problem with the specific transcript route implementation</p>
          </div>
          <div>
            <h3 className="font-semibold">If all App Router endpoints return 404:</h3>
            <p className="ml-4">- This suggests an App Router configuration issue in Next.js or Vercel</p>
          </div>
          <div>
            <h3 className="font-semibold">If Pages Router endpoint works but App Router doesn't:</h3>
            <p className="ml-4">- We should switch to using the Pages Router implementation</p>
          </div>
          <div>
            <h3 className="font-semibold">If all endpoints are failing:</h3>
            <p className="ml-4">- This indicates a more fundamental server/deployment issue</p>
          </div>
        </div>
      </div>
    </div>
  );
}