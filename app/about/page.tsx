import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
            상상 더하기+
          </Link>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition"
            >
              홈
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-indigo-600 font-medium"
            >
              소개
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              로그인
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium shadow-lg mb-6">
            2025년 전라남도 정책 아이디어 공모전 출품작
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            상상 더하기<span className="text-indigo-600">+</span>
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            전남형 AI 정책 발굴 플랫폼
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            데이터와 AI의 창의성으로 전라남도의 정책 혁신을 가속화하는 핵심 의사결정 지원 플랫폼
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            해결하고자 하는 문제
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              전라남도는 급격한 인구감소, 지역경제 침체, 농촌 공동화 등 복합적인 지역 문제에 직면해 있습니다.
              기존의 정책 수립 방식은 제한적인 인적 자원과 시간 속에서 진행되어,
              혁신적이고 다각적인 정책 아이디어 발굴에 한계가 있었습니다.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl mb-2">⚠️</div>
                <h3 className="font-bold text-red-900 mb-2">시간 제약</h3>
                <p className="text-sm text-red-800">
                  담당자들의 업무 과중으로 창의적 아이디어 발굴 시간 부족
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="text-2xl mb-2">💭</div>
                <h3 className="font-bold text-orange-900 mb-2">관점 제한</h3>
                <p className="text-sm text-orange-800">
                  기존 틀에 갇힌 사고로 인한 혁신적 아이디어 발굴 어려움
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-bold text-yellow-900 mb-2">데이터 활용</h3>
                <p className="text-sm text-yellow-800">
                  방대한 정책 데이터와 사례를 효율적으로 활용하지 못함
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">💡</span>
            우리의 솔루션
          </h2>
          <p className="text-xl mb-6 leading-relaxed">
            <span className="font-bold">상상 더하기+</span>는 Claude AI를 활용하여
            정책 담당자들의 창의적 정책 발굴을 지원하는 AI 기반 플랫폼입니다.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span>🤖</span> AI 기반 아이디어 생성
              </h3>
              <p className="text-white/90">
                Claude AI가 전라남도의 특성과 정책 목표를 분석하여
                실현 가능한 창의적 정책 아이디어를 자동 생성합니다.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span>🎲</span> 창의 탐색 모드
              </h3>
              <p className="text-white/90">
                버벌라이즈드 샘플링 기법을 통해 저확률·고잠재력 아이디어를 발굴하여
                혁신적인 정책 방향을 제시합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <span className="text-4xl">✨</span>
            주요 기능
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl">
                  💡
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    AI 아이디어 생성
                  </h3>
                  <p className="text-gray-600">
                    Claude 3.7 Sonnet 모델을 활용하여 정책 분야별 맞춤형 아이디어 생성
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    창의 탐색 모드
                  </h3>
                  <p className="text-gray-600">
                    verbalized sampling을 통한 저확률·고잠재력 정책 아이디어 발굴
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-2xl">
                  📁
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    아이디어 관리
                  </h3>
                  <p className="text-gray-600">
                    생성된 아이디어를 카테고리별로 분류하고 체계적으로 저장·관리
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                  🌐
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    아이디어 공유
                  </h3>
                  <p className="text-gray-600">
                    우수 아이디어를 다른 담당자들과 공유하여 협업 촉진
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl">
                  📊
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    통계 대시보드
                  </h3>
                  <p className="text-gray-600">
                    생성된 아이디어 현황과 카테고리별 분포를 한눈에 파악
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  🔍
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    맞춤형 프롬프트
                  </h3>
                  <p className="text-gray-600">
                    전라남도 특화 시스템 프롬프트로 실현 가능한 아이디어 생성
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Categories */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">🏛️</span>
            지원 정책 분야
          </h2>
          <p className="text-gray-600 mb-6">
            전라남도의 핵심 정책 과제를 중심으로 5개 주요 분야를 지원합니다.
          </p>
          <div className="grid md:grid-cols-5 gap-4">
            {[
              { name: '인구감소대응', icon: '👥', desc: '인구 유입 및 정착 지원' },
              { name: '신산업육성', icon: '🏭', desc: '미래 성장동력 발굴' },
              { name: '지역경제활성화', icon: '💼', desc: '일자리 창출 및 경제 활성화' },
              { name: '문화관광진흥', icon: '🎭', desc: '문화·관광 자원 개발' },
              { name: '농축수산혁신', icon: '🌾', desc: '1차 산업 혁신 및 발전' },
            ].map((category) => (
              <div
                key={category.name}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl hover:shadow-lg transition text-center border border-indigo-100"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-xs text-gray-600">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">🛠️</span>
            기술 스택
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Frontend</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">▸</span> Next.js 15 (App Router)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">▸</span> React 19
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">▸</span> TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">▸</span> Tailwind CSS
                </li>
              </ul>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Backend & Database</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">▸</span> Supabase (PostgreSQL)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">▸</span> Supabase Auth
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">▸</span> Row Level Security
                </li>
              </ul>
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">AI & Deployment</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">▸</span> Claude 3.7 Sonnet
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">▸</span> Anthropic API
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">▸</span> Vercel (호스팅)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Expected Impact */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl shadow-xl p-8 mb-12 border-2 border-green-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-4xl">📈</span>
            기대 효과
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-lg text-green-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                정책 발굴 효율성 향상
              </h3>
              <p className="text-gray-700">
                AI 지원으로 정책 아이디어 발굴 시간을 대폭 단축하고,
                담당자들이 정책 실행에 더 집중할 수 있습니다.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-lg text-green-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                창의적 정책 발굴
              </h3>
              <p className="text-gray-700">
                기존 틀을 벗어난 혁신적인 정책 아이디어를 발굴하여
                전라남도의 정책 경쟁력을 강화합니다.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-lg text-green-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                부서 간 협업 강화
              </h3>
              <p className="text-gray-700">
                우수 아이디어 공유를 통해 부서 간 벽을 허물고
                시너지를 창출할 수 있습니다.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h3 className="font-bold text-lg text-green-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                데이터 기반 의사결정
              </h3>
              <p className="text-gray-700">
                AI가 다양한 정책 사례와 데이터를 분석하여
                실효성 있는 정책 방향을 제시합니다.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-indigo-600 text-white rounded-2xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">OK! 지금은 전남시대</h2>
          <p className="text-xl mb-8">
            AI와 함께 전라남도의 미래를 설계하세요
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition text-lg"
            >
              지금 시작하기 →
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition text-lg flex items-center gap-2"
            >
              <span>🚀</span>
              데모 체험하기
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-600">
          <p className="text-sm">2025년 전라남도 정책 아이디어 공모전 출품작</p>
          <p className="text-sm mt-2">상상 더하기+ 팀</p>
          <p className="text-xs mt-4 text-gray-500">
            본 플랫폼은 Claude AI를 활용한 정책 발굴 지원 도구로, 최종 정책 결정은 담당자의 검토와 판단을 거쳐야 합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
