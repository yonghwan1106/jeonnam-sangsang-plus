#!/usr/bin/env tsx
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Supabase 클라이언트 생성
const supabaseUrl = 'https://mquleujycyikiqzagtjh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xdWxldWp5Y3lpa2lxemFndGpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk0OTE5MSwiZXhwIjoyMDc2NTI1MTkxfQ.pnc1lt_JbwC-T9pd5tahsD-WtLkILbqqHbGJddegjRk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Google Sheets 클라이언트 생성
function getGoogleSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

async function initializeSheets() {
  console.log('📝 Initializing Google Sheets...');
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

    console.log('✅ Headers created');
  } catch (error) {
    console.error('Failed to initialize sheets:', error);
    throw error;
  }
}

async function migrateUsers() {
  console.log('\n👥 Migrating users from Supabase...');
  const sheets = getGoogleSheetsClient();

  try {
    // Supabase에서 사용자 목록 가져오기
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      throw authError;
    }

    if (!authUsers || authUsers.users.length === 0) {
      console.log('⚠️  No users found in Supabase');
      return;
    }

    console.log(`Found ${authUsers.users.length} users`);

    // Google Sheets에 사용자 추가
    const userRows = authUsers.users.map(user => [
      user.id,
      user.email || '',
      '', // 비밀번호는 마이그레이션 불가 (해시됨)
      user.created_at
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:D',
      valueInputOption: 'RAW',
      requestBody: {
        values: userRows,
      },
    });

    console.log(`✅ Migrated ${userRows.length} users`);
    return authUsers.users;
  } catch (error) {
    console.error('Failed to migrate users:', error);
    throw error;
  }
}

async function migrateIdeas() {
  console.log('\n💡 Migrating ideas from Supabase...');
  const sheets = getGoogleSheetsClient();

  try {
    // Supabase에서 아이디어 가져오기
    const { data: ideas, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!ideas || ideas.length === 0) {
      console.log('⚠️  No ideas found in Supabase');
      return;
    }

    console.log(`Found ${ideas.length} ideas`);

    // Google Sheets에 아이디어 추가
    const ideaRows = ideas.map(idea => [
      idea.id,
      idea.user_id,
      idea.title,
      idea.content,
      idea.category,
      idea.mode || 'general',
      idea.probability || '',
      JSON.stringify(idea.keywords || []),
      idea.saved || false,
      idea.is_shared || false,
      idea.created_at
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A:K',
      valueInputOption: 'RAW',
      requestBody: {
        values: ideaRows,
      },
    });

    console.log(`✅ Migrated ${ideaRows.length} ideas`);
  } catch (error) {
    console.error('Failed to migrate ideas:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Supabase to Google Sheets migration...\n');
  console.log(`Spreadsheet ID: ${SPREADSHEET_ID}\n`);

  if (!SPREADSHEET_ID) {
    console.error('❌ GOOGLE_SHEETS_SPREADSHEET_ID is not set');
    process.exit(1);
  }

  try {
    // 1. 시트 초기화
    await initializeSheets();

    // 2. 사용자 마이그레이션
    await migrateUsers();

    // 3. 아이디어 마이그레이션
    await migrateIdeas();

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify the data in your Google Sheet:');
    console.log(`   https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
    console.log('2. Test the application with: npm run dev');
    console.log('3. If everything works, you can pause/delete the Supabase project');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
