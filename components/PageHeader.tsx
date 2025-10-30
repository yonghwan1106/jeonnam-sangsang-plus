'use client';

import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  showBackButton?: boolean;
}

export default function PageHeader({ title, description, icon, showBackButton = true }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {showBackButton && (
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            대시보드로 돌아가기
          </button>
        )}
        <div className="flex items-center gap-4">
          {icon && (
            <div className="text-5xl">{icon}</div>
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            {description && (
              <p className="text-white/90 text-lg">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
