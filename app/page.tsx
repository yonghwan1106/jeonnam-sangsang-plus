import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Contest Badge */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium shadow-lg">
            2025년 전라남도 정책 아이디어 공모전 출품작
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            상상 더하기<span className="text-indigo-600">+</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            전남형 AI 정책 발굴 플랫폼
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            데이터와 AI의 창의성으로 전라남도의 정책 혁신을 가속화하는
            <br />
            핵심 의사결정 지원 플랫폼
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              시작하기
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition"
            >
              로그인
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              AI 기반 아이디어 생성
            </h3>
            <p className="text-gray-600">
              Claude AI를 활용하여 창의적이고 실현 가능한 정책 아이디어를 자동으로 생성합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              창의 탐색 모드
            </h3>
            <p className="text-gray-600">
              버벌라이즈드 샘플링을 통해 저확률·고잠재력 아이디어를 발굴합니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              체계적인 관리
            </h3>
            <p className="text-gray-600">
              생성된 아이디어를 저장하고 분류하여 효율적으로 관리할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Policy Categories */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            정책 분야
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['인구감소대응', '신산업육성', '지역경제활성화', '문화관광진흥', '농축수산혁신'].map(
              (category) => (
                <div
                  key={category}
                  className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition"
                >
                  <span className="font-medium text-gray-800">{category}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-indigo-600 text-white rounded-2xl p-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">OK! 지금은 전남시대</h2>
          <p className="text-lg mb-6">
            혁신적인 정책 아이디어로 전라남도의 미래를 함께 만들어갑니다
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            지금 시작하기 →
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600 text-sm">
          <p>2025년 전라남도 정책 아이디어 공모전 출품작</p>
          <p className="mt-2">AI 기반 정책 혁신 플랫폼</p>
        </div>
      </div>
    </div>
  );
}
