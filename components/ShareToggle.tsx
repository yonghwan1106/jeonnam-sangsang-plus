'use client';

import { useState } from 'react';

interface ShareToggleProps {
  ideaId: string;
  initialIsShared: boolean;
}

export default function ShareToggle({ ideaId, initialIsShared }: ShareToggleProps) {
  const [isShared, setIsShared] = useState(initialIsShared);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/toggle-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId,
          isShared: !isShared,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle share');
      }

      setIsShared(!isShared);
    } catch (error) {
      console.error('Error toggling share:', error);
      alert('공유 상태를 변경하는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`px-3 py-1 text-sm rounded-full transition ${
        isShared
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? '처리중...' : isShared ? '공유됨 🌐' : '공유하기'}
    </button>
  );
}
