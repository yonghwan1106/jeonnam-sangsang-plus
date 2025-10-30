import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ideas as ideasLib, users } from '@/lib/google-sheets';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export default async function SharedIdeasPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // 공유된 아이디어 가져오기
  const ideasList = await ideasLib.findShared({ order: 'desc' });

  // 각 아이디어의 작성자 정보 가져오기
  const ideasWithProfiles = await Promise.all(
    ideasList.map(async (idea) => {
      const author = await users.findById(idea.user_id);
      return {
        ...idea,
        profiles: author ? { email: author.email, full_name: null } : null
      };
    })
  );

  const error = null;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="공유된 아이디어"
        description="다른 사용자들이 공유한 혁신적인 정책 아이디어를 탐색해보세요"
        icon="🌐"
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            오류가 발생했습니다: {error}
          </div>
        ) : ideasWithProfiles && ideasWithProfiles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {ideasWithProfiles.map((idea) => (
              <div
                key={idea.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                    {idea.category}
                  </span>
                  {idea.probability && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                      독창성 Lv.{21 - idea.probability}
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
                <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-3 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      {Array.isArray(idea.profiles)
                        ? '익명'
                        : (idea.profiles?.full_name || idea.profiles?.email || '익명')}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(idea.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {idea.mode === 'general' ? '일반 탐색' : '창의 탐색'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🌐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              아직 공유된 아이디어가 없습니다
            </h2>
            <p className="text-gray-600 mb-6">
              첫 번째로 아이디어를 공유해보세요!
            </p>
            <Link
              href="/my-ideas"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              내 아이디어 보기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
