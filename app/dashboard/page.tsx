import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

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

  // 통계 데이터 가져오기
  const { count: totalIdeas } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: savedIdeas } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('saved', true);

  // 이번 달 생성된 아이디어
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count: monthlyIdeas } = await supabase
    .from('ideas')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth);

  // 최근 아이디어 가져오기
  const { data: recentIdeas } = await supabase
    .from('ideas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // 카테고리별 분포
  const { data: categoryData } = await supabase
    .from('ideas')
    .select('category')
    .eq('user_id', user.id);

  const categoryCount = categoryData?.reduce((acc: Record<string, number>, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = categoryCount && Object.keys(categoryCount).length > 0
    ? Object.entries(categoryCount).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0][0]
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-indigo-600">상상 더하기+</h1>
            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              2025 전남 공모전
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {profile?.full_name || user.email}
              </div>
              {profile?.department && (
                <div className="text-xs text-gray-500">{profile.department}</div>
              )}
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                환영합니다, {profile?.full_name || '사용자'}님! 👋
              </h2>
              <p className="text-lg opacity-90">
                AI와 함께 혁신적인 정책 아이디어를 발굴해보세요
              </p>
              {topCategory && (
                <p className="text-sm mt-2 opacity-75">
                  가장 관심있는 분야: <span className="font-semibold">{topCategory}</span>
                </p>
              )}
            </div>
            <div className="hidden md:block text-6xl opacity-20">💡</div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-600 mb-1">총 아이디어</div>
                <div className="text-3xl font-bold text-indigo-600">{totalIdeas || 0}</div>
              </div>
              <div className="text-3xl">📊</div>
            </div>
            <div className="text-xs text-gray-500 mt-2">전체 생성된 아이디어</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-600 mb-1">저장된 아이디어</div>
                <div className="text-3xl font-bold text-purple-600">{savedIdeas || 0}</div>
              </div>
              <div className="text-3xl">💾</div>
            </div>
            <div className="text-xs text-gray-500 mt-2">내 서랍에 보관 중</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-600">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-600 mb-1">이번 달</div>
                <div className="text-3xl font-bold text-pink-600">{monthlyIdeas || 0}</div>
              </div>
              <div className="text-3xl">📅</div>
            </div>
            <div className="text-xs text-gray-500 mt-2">이번 달 생성</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-600 mb-1">활동률</div>
                <div className="text-3xl font-bold text-green-600">
                  {totalIdeas && totalIdeas > 0 ? Math.round((savedIdeas! / totalIdeas!) * 100) : 0}%
                </div>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
            <div className="text-xs text-gray-500 mt-2">저장 비율</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/generate"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-indigo-600"
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">💡</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                  새 아이디어 생성
                </h3>
                <p className="text-gray-600 mb-4">
                  Claude AI를 활용하여 창의적이고 실현 가능한 정책 아이디어를 생성합니다
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
                    일반 탐색
                  </span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                    창의 탐색
                  </span>
                </div>
                <div className="mt-4 text-indigo-600 font-medium flex items-center gap-2">
                  시작하기
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/my-ideas"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group border-2 border-transparent hover:border-purple-600"
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">📁</div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition">
                  내 아이디어
                </h3>
                <p className="text-gray-600 mb-4">
                  저장된 아이디어를 확인하고 체계적으로 관리합니다
                </p>
                <div className="text-sm text-gray-500">
                  {savedIdeas && savedIdeas > 0 ? (
                    <span>💾 {savedIdeas}개의 아이디어가 저장되어 있습니다</span>
                  ) : (
                    <span>아직 저장된 아이디어가 없습니다</span>
                  )}
                </div>
                <div className="mt-4 text-purple-600 font-medium flex items-center gap-2">
                  보러가기
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
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

        {/* Recent Ideas */}
        {recentIdeas && recentIdeas.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">최근 생성된 아이디어</h3>
              <Link
                href="/my-ideas"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                전체보기 →
              </Link>
            </div>
            <div className="space-y-3">
              {recentIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 flex-1">{idea.title}</h4>
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full ml-2">
                      {idea.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {idea.content}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {idea.keywords?.slice(0, 3).map((keyword: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(idea.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!recentIdeas || recentIdeas.length === 0) && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              첫 번째 아이디어를 만들어보세요!
            </h3>
            <p className="text-gray-600 mb-6">
              AI와 함께 혁신적인 정책 아이디어를 발굴해보세요
            </p>
            <Link
              href="/generate"
              className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              아이디어 생성하기 →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
