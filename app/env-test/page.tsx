'use client';

import { useEffect } from 'react';

export default function EnvTestPage() {
  useEffect(() => {
    console.log('Environment Test Page');
    console.log('NEXT_PUBLIC_MAPBOX_TOKEN:', process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('All env vars:', process.env);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p>NEXT_PUBLIC_MAPBOX_TOKEN: {process.env.NEXT_PUBLIC_MAPBOX_TOKEN}</p>
        <p>NODE_ENV: {process.env.NODE_ENV}</p>
      </div>
      <p className="mt-4 text-sm text-gray-600">Check the console for more details</p>
    </div>
  );
} 