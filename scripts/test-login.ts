#!/usr/bin/env tsx
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { users } from '../lib/google-sheets';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function testLogin() {
  console.log('🔍 Testing Google Sheets connection and user data...\n');

  try {
    // 테스트 이메일
    const testEmail = 'sanoramyun8@gmail.com';

    console.log(`Looking for user: ${testEmail}`);

    const user = await users.findByEmail(testEmail);

    if (user) {
      console.log('✅ User found!');
      console.log('User ID:', user.id);
      console.log('Email:', user.email);
      console.log('Created at:', user.created_at);
    } else {
      console.log('❌ User not found');
      console.log('\nTrying to list all users...');

      // Google Sheets에서 직접 데이터 읽기
      const { google } = await import('googleapis');
      const { JWT } = await import('google-auth-library');

      const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
      const auth = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });
      const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Users!A:D',
      });

      const rows = response.data.values;
      console.log('\nAll users in sheet:');
      console.log('Total rows:', rows?.length || 0);

      if (rows && rows.length > 0) {
        console.log('\nFirst 5 rows:');
        rows.slice(0, 5).forEach((row, index) => {
          console.log(`Row ${index}:`, row);
        });
      }
    }

    // 비밀번호 확인 테스트
    console.log('\n🔐 Testing password verification...');
    const testPassword = 'your_test_password'; // 실제 비밀번호로 변경 필요
    const isValid = await users.verifyPassword(testEmail, testPassword);
    console.log('Password valid:', isValid);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testLogin();
