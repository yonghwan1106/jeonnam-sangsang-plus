#!/usr/bin/env tsx
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';

function getGoogleSheetsClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');

  const auth = new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

async function resetPassword(email: string, newPassword: string) {
  console.log(`🔄 Resetting password for: ${email}\n`);

  const sheets = getGoogleSheetsClient();

  try {
    // Users 데이터 가져오기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:D',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('❌ No users found');
      return;
    }

    // 이메일로 사용자 찾기
    let userRowIndex = -1;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1] === email) {
        userRowIndex = i;
        break;
      }
    }

    if (userRowIndex === -1) {
      console.log(`❌ User not found: ${email}`);
      return;
    }

    // 비밀번호 업데이트
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Users!C${userRowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[newPassword]],
      },
    });

    console.log('✅ Password reset successfully!');
    console.log(`Email: ${email}`);
    console.log(`New password: ${newPassword}`);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// 사용법: npx tsx scripts/reset-user-password.ts
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: npx tsx scripts/reset-user-password.ts <email> <new-password>');
  console.log('Example: npx tsx scripts/reset-user-password.ts user@example.com newpass123');
  process.exit(1);
}

resetPassword(args[0], args[1]);
