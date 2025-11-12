'use client';

import { useEffect, useState } from 'react';
import { getDataFreshnessMessage, isDataPotentiallyStale } from '@/lib/date-utils';

export default function DataFreshness() {
  const [message, setMessage] = useState<string>('');
  const [isStale, setIsStale] = useState<boolean>(false);
  
  useEffect(() => {
    setMessage(getDataFreshnessMessage());
    setIsStale(isDataPotentiallyStale());
  }, []);
  
  if (!message) return null;
  
  return (
    <div className={`rounded-lg p-4 mb-6 border-l-4 ${
      isStale 
        ? 'bg-yellow-50 border-yellow-500' 
        : 'bg-blue-50 border-blue-500'
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">
          {isStale ? '⚠️' : '📊'}
        </span>
        <div>
          <p className={`font-semibold ${
            isStale ? 'text-yellow-900' : 'text-blue-900'
          }`}>
            Data Source & Freshness
          </p>
          <p className={`text-sm mt-1 ${
            isStale ? 'text-yellow-700' : 'text-blue-700'
          }`}>
            {message}
          </p>
          <p className={`text-xs mt-2 ${
            isStale ? 'text-yellow-600' : 'text-blue-600'
          }`}>
            Last updated: {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}