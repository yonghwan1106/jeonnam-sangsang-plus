import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function MyIdeasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 저장된 아이디어 가져오기
  const { data: ideas, error } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', user.id)
    .eq('saved', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700"
          >
            ← 상상 더하기+
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">내 아이디어</h1>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            오류가 발생했습니다: {error.message}
          </div>
        ) : ideas && ideas.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                    {idea.category}
                  </span>
                  {idea.probability && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {idea.probability}%
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {idea.title}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {idea.content}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.keywords?.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    {new Date(idea.created_at).toLocaleDateString('ko-KR')}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {idea.mode === 'general' ? '일반 탐색' : '창의 탐색'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💡</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              아직 저장된 아이디어가 없습니다
            </h2>
            <p className="text-gray-600 mb-6">
              AI와 함께 첫 번째 정책 아이디어를 생성해보세요!
            </p>
            <Link
              href="/generate"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              아이디어 생성하기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
