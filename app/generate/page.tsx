'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PolicyCategory, GeneratedIdea } from '@/types';

const POLICY_CATEGORIES: PolicyCategory[] = [
  '인구감소대응',
  '신산업육성',
  '지역경제활성화',
  '문화관광진흥',
  '농축수산혁신',
];

export default function GeneratePage() {
  const router = useRouter();
  const [category, setCategory] = useState<PolicyCategory>('인구감소대응');
  const [problemStatement, setProblemStatement] = useState('');
  const [mode, setMode] = useState<'general' | 'creative'>('general');
  const [creativityLevel, setCreativityLevel] = useState(5); // 1(안정적) ~ 10(매우 독창적)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<GeneratedIdea[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setGeneratedIdeas([]);

    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          problemStatement,
          mode,
          // 레벨 1(안정적) → probability 20, 레벨 10(독창적) → probability 1
          creativityLevel: mode === 'creative' ? 21 - creativityLevel : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json() as { error?: string };
        throw new Error(errorData.error || '아이디어 생성에 실패했습니다.');
      }

      const data = await response.json() as { ideas: GeneratedIdea[] };
      setGeneratedIdeas(data.ideas);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '아이디어 생성 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async (idea: GeneratedIdea) => {
    try {
      const response = await fetch('/api/save-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...idea,
          category,
          mode,
          probability: idea.probability,
        }),
      });

      if (!response.ok) {
        throw new Error('아이디어 저장에 실패했습니다.');
      }

      alert('아이디어가 저장되었습니다!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '아이디어 저장 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
          >
            ← 상상 더하기+
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            AI 정책 아이디어 생성
          </h1>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정책 대주제 *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PolicyCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {POLICY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Problem Statement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                핵심 문제 및 현황 *
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                placeholder="해결하고자 하는 문제나 개선하고자 하는 현황을 자유롭게 기술해주세요..."
                required
              />
            </div>

            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                탐색 모드
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode('general')}
                  className={`p-4 border-2 rounded-lg transition ${
                    mode === 'general'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">일반 탐색</div>
                  <div className="text-sm text-gray-600">
                    실현 가능성이 높은 아이디어
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('creative')}
                  className={`p-4 border-2 rounded-lg transition ${
                    mode === 'creative'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">창의 탐색 ✨</div>
                  <div className="text-sm text-gray-600">
                    독창적이고 혁신적인 아이디어
                  </div>
                </button>
              </div>
            </div>

            {/* Creativity Level (only for creative mode) */}
            {mode === 'creative' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  독창성 레벨: <span className="text-purple-600 font-bold text-lg">{creativityLevel}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span className="flex flex-col items-start">
                    <span className="font-semibold text-indigo-600">레벨 1</span>
                    <span className="text-gray-500">안정적 · 실현 가능</span>
                  </span>
                  <span className="flex flex-col items-center">
                    <span className="font-semibold text-purple-600">레벨 5-6</span>
                    <span className="text-gray-500">균형잡힌</span>
                  </span>
                  <span className="flex flex-col items-end">
                    <span className="font-semibold text-pink-600">레벨 10</span>
                    <span className="text-gray-500">매우 독창적 · 혁신적</span>
                  </span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '생성 중...' : '아이디어 생성하기'}
            </button>
          </form>

          {/* Results */}
          {generatedIdeas.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                생성된 아이디어
              </h2>
              <div className="space-y-4">
                {generatedIdeas.map((idea, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">
                        {idea.title}
                      </h3>
                      {idea.probability && (
                        <span className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                          독창성 Lv.{21 - idea.probability}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4 whitespace-pre-line">
                      {idea.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {idea.keywords.map((keyword, kIndex) => (
                        <span
                          key={kIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleSaveIdea(idea)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                    >
                      저장하기
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
