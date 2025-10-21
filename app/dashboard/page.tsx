import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 사용자 프로필 가져오기
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">상상 더하기+</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {profile?.full_name || user.email}님
            </span>
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">
            환영합니다, {profile?.full_name || '사용자'}님!
          </h2>
          <p className="text-lg opacity-90">
            AI와 함께 혁신적인 정책 아이디어를 발굴해보세요
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/generate"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                  새 아이디어 생성
                </h3>
                <p className="text-gray-600">
                  AI를 활용하여 창의적인 정책 아이디어를 생성합니다
                </p>
                <div className="mt-4 text-indigo-600 font-medium flex items-center gap-2">
                  시작하기
                  <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/my-ideas"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">📁</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                  내 아이디어
                </h3>
                <p className="text-gray-600">
                  저장된 아이디어를 확인하고 관리합니다
                </p>
                <div className="mt-4 text-indigo-600 font-medium flex items-center gap-2">
                  보러가기
                  <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/shared-ideas"
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">🌐</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                  공유된 아이디어
                </h3>
                <p className="text-gray-600">
                  다른 사람들이 공유한 아이디어를 확인합니다
                </p>
                <div className="mt-4 text-indigo-600 font-medium flex items-center gap-2">
                  탐색하기
                  <span className="group-hover:translate-x-1 transition">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">통계</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-indigo-600">0</div>
              <div className="text-sm text-gray-600 mt-1">생성된 아이디어</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600 mt-1">저장된 아이디어</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-pink-600">0</div>
              <div className="text-sm text-gray-600 mt-1">이번 달 생성</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
