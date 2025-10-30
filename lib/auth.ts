import { cookies } from 'next/headers';
import { users, User } from './google-sheets';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface Session {
  userId: string;
  email: string;
  expiresAt: number;
}

// 세션 생성
export async function createSession(user: User): Promise<string> {
  const session: Session = {
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + SESSION_DURATION,
  };

  const sessionToken = Buffer.from(JSON.stringify(session)).toString('base64');

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  });

  return sessionToken;
}

// 세션 가져오기
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionToken) {
    return null;
  }

  try {
    const session: Session = JSON.parse(
      Buffer.from(sessionToken.value, 'base64').toString('utf-8')
    );

    // 세션 만료 확인
    if (session.expiresAt < Date.now()) {
      await deleteSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Invalid session:', error);
    return null;
  }
}

// 현재 사용자 가져오기
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  try {
    const user = await users.findById(session.userId);
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

// 세션 삭제
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// 사용자 회원가입
export async function signUp(email: string, password: string): Promise<{ user: User; error?: string }> {
  try {
    // 이메일 중복 확인
    const existingUser = await users.findByEmail(email);
    if (existingUser) {
      return { user: existingUser, error: '이미 존재하는 이메일입니다.' };
    }

    // 사용자 생성
    const user = await users.create(email, password);

    // 세션 생성
    await createSession(user);

    return { user };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      user: { id: '', email: '', created_at: '' },
      error: '회원가입 중 오류가 발생했습니다.',
    };
  }
}

// 사용자 로그인
export async function signIn(email: string, password: string): Promise<{ user?: User; error?: string }> {
  try {
    // 비밀번호 확인
    const isValid = await users.verifyPassword(email, password);
    if (!isValid) {
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    // 사용자 가져오기
    const user = await users.findByEmail(email);
    if (!user) {
      return { error: '사용자를 찾을 수 없습니다.' };
    }

    // 세션 생성
    await createSession(user);

    return { user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { error: '로그인 중 오류가 발생했습니다.' };
  }
}

// 로그아웃
export async function signOut(): Promise<void> {
  await deleteSession();
}
