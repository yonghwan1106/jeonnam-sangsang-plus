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

async function checkUser(email: string) {
  console.log(`🔍 Checking user: ${email}\n`);
  console.log(`Spreadsheet ID: ${SPREADSHEET_ID}\n`);

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

    console.log(`✅ Found ${rows.length - 1} users (excluding header)\n`);

    // 이메일로 사용자 찾기
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1] === email) {
        console.log('✅ User found!');
        console.log(`Row ${i + 1}:`);
        console.log(`  ID: ${rows[i][0]}`);
        console.log(`  Email: ${rows[i][1]}`);
        console.log(`  Password: ${rows[i][2]}`);
        console.log(`  Created at: ${rows[i][3]}`);
        return;
      }
    }

    console.log(`❌ User not found: ${email}`);
    console.log('\nAll users:');
    for (let i = 1; i < Math.min(rows.length, 6); i++) {
      console.log(`  ${rows[i][1]}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// 사용법: npx tsx scripts/check-user.ts <email>
const args = process.argv.slice(2);
const email = args[0] || 'sanoramyun8@gmail.com';

checkUser(email);
