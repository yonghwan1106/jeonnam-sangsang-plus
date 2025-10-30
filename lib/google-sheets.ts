import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Google Sheets API 클라이언트 초기화
function getGoogleSheetsClient() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');

    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Failed to initialize Google Sheets client:', error);
    throw new Error('Google Sheets 인증에 실패했습니다.');
  }
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

// 사용자 인터페이스
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// 아이디어 인터페이스
export interface Idea {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  mode: 'general' | 'creative';
  probability?: number | null;
  keywords?: string[];
  saved: boolean;
  is_shared?: boolean;
  created_at: string;
}

// 행 데이터를 Idea 객체로 변환
function rowToIdea(row: (string | number | boolean)[]): Idea | null {
  if (!row || row.length < 10) return null;

  return {
    id: String(row[0] || ''),
    user_id: String(row[1] || ''),
    title: String(row[2] || ''),
    content: String(row[3] || ''),
    category: String(row[4] || ''),
    mode: (row[5] as 'general' | 'creative') || 'general',
    probability: row[6] ? Number(row[6]) : null,
    keywords: row[7] ? JSON.parse(String(row[7])) : [],
    saved: row[8] === 'TRUE' || row[8] === true,
    is_shared: row[9] === 'TRUE' || row[9] === true,
    created_at: String(row[10] || new Date().toISOString()),
  };
}

// Idea 객체를 행 데이터로 변환
function ideaToRow(idea: Partial<Idea>): (string | number | boolean)[] {
  return [
    idea.id || '',
    idea.user_id || '',
    idea.title || '',
    idea.content || '',
    idea.category || '',
    idea.mode || 'general',
    idea.probability !== undefined && idea.probability !== null ? idea.probability : '',
    idea.keywords ? JSON.stringify(idea.keywords) : '[]',
    idea.saved !== undefined ? idea.saved : false,
    idea.is_shared !== undefined ? idea.is_shared : false,
    idea.created_at || new Date().toISOString(),
  ];
}

// 사용자 관련 함수들
export const users = {
  // 사용자 생성
  async create(email: string, password: string): Promise<User> {
    const sheets = getGoogleSheetsClient();
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    const user: User = {
      id: userId,
      email,
      created_at: createdAt,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:D',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[userId, email, password, createdAt]],
      },
    });

    return user;
  },

  // 이메일로 사용자 찾기
  async findByEmail(email: string): Promise<User | null> {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return null;

    // 헤더 건너뛰기
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] === email) {
        return {
          id: row[0],
          email: row[1],
          created_at: row[3],
        };
      }
    }

    return null;
  },

  // ID로 사용자 찾기
  async findById(id: string): Promise<User | null> {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return null;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === id) {
        return {
          id: row[0],
          email: row[1],
          created_at: row[3],
        };
      }
    }

    return null;
  },

  // 비밀번호 확인
  async verifyPassword(email: string, password: string): Promise<boolean> {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return false;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] === email && row[2] === password) {
        return true;
      }
    }

    return false;
  },
};

// 아이디어 관련 함수들
export const ideas = {
  // 아이디어 생성
  async create(idea: Omit<Idea, 'id' | 'created_at'>): Promise<Idea> {
    const sheets = getGoogleSheetsClient();
    const ideaId = `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();

    const newIdea: Idea = {
      ...idea,
      id: ideaId,
      created_at: createdAt,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A:K',
      valueInputOption: 'RAW',
      requestBody: {
        values: [ideaToRow(newIdea)],
      },
    });

    return newIdea;
  },

  // 사용자의 아이디어 목록 가져오기
  async findByUserId(userId: string, options?: { saved?: boolean; order?: 'asc' | 'desc' }): Promise<Idea[]> {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A:K',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    const ideasList: Idea[] = [];

    // 헤더 건너뛰기
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1] === userId) {
        const idea = rowToIdea(row);
        if (idea) {
          // saved 필터 적용
          if (options?.saved !== undefined && idea.saved !== options.saved) {
            continue;
          }
          ideasList.push(idea);
        }
      }
    }

    // 정렬
    ideasList.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return options?.order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return ideasList;
  },

  // 공유된 아이디어 목록 가져오기
  async findShared(options?: { order?: 'asc' | 'desc' }): Promise<Idea[]> {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A:K',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return [];

    const ideasList: Idea[] = [];

    // 헤더 건너뛰기
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const idea = rowToIdea(row);
      if (idea && idea.is_shared) {
        ideasList.push(idea);
      }
    }

    // 정렬
    ideasList.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return options?.order === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return ideasList;
  },

  // ID로 아이디어 찾기
  async findById(id: string): Promise<Idea | null> {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A:K',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return null;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === id) {
        return rowToIdea(row);
      }
    }

    return null;
  },

  // 아이디어 업데이트
  async update(id: string, updates: Partial<Idea>): Promise<Idea | null> {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A:K',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return null;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === id) {
        const currentIdea = rowToIdea(row);
        if (!currentIdea) return null;

        const updatedIdea = { ...currentIdea, ...updates };

        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `Ideas!A${i + 1}:K${i + 1}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [ideaToRow(updatedIdea)],
          },
        });

        return updatedIdea;
      }
    }

    return null;
  },

  // 아이디어 삭제
  async delete(id: string): Promise<boolean> {
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A:K',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return false;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] === id) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: 0, // Ideas 시트의 ID (기본값 0)
                    dimension: 'ROWS',
                    startIndex: i,
                    endIndex: i + 1,
                  },
                },
              },
            ],
          },
        });
        return true;
      }
    }

    return false;
  },
};

// 시트 초기화 (최초 1회 실행)
export async function initializeSheets() {
  const sheets = getGoogleSheetsClient();

  try {
    // Users 시트 헤더 생성
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A1:D1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['ID', 'Email', 'Password', 'Created At']],
      },
    });

    // Ideas 시트 헤더 생성
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A1:K1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['ID', 'User ID', 'Title', 'Content', 'Category', 'Mode', 'Probability', 'Keywords', 'Saved', 'Is Shared', 'Created At']],
      },
    });

    console.log('Google Sheets initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Google Sheets:', error);
    throw error;
  }
}
