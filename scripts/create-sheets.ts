#!/usr/bin/env tsx
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

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

async function createSheets() {
  console.log('🚀 Creating sheets in Google Spreadsheet...\n');
  console.log(`Spreadsheet ID: ${SPREADSHEET_ID}\n`);

  if (!SPREADSHEET_ID) {
    console.error('❌ GOOGLE_SHEETS_SPREADSHEET_ID is not set');
    process.exit(1);
  }

  const sheets = getGoogleSheetsClient();

  try {
    // 현재 스프레드시트 정보 가져오기
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    console.log(`📊 Spreadsheet: ${spreadsheet.data.properties?.title}\n`);

    const existingSheets = spreadsheet.data.sheets?.map(sheet => sheet.properties?.title) || [];
    console.log('Existing sheets:', existingSheets);

    const requests: any[] = [];

    // Users 시트가 없으면 생성
    if (!existingSheets.includes('Users')) {
      console.log('✨ Creating "Users" sheet...');
      requests.push({
        addSheet: {
          properties: {
            title: 'Users',
            gridProperties: {
              rowCount: 1000,
              columnCount: 4,
              frozenRowCount: 1, // 헤더 행 고정
            },
          },
        },
      });
    } else {
      console.log('✓ "Users" sheet already exists');
    }

    // Ideas 시트가 없으면 생성
    if (!existingSheets.includes('Ideas')) {
      console.log('✨ Creating "Ideas" sheet...');
      requests.push({
        addSheet: {
          properties: {
            title: 'Ideas',
            gridProperties: {
              rowCount: 1000,
              columnCount: 11,
              frozenRowCount: 1, // 헤더 행 고정
            },
          },
        },
      });
    } else {
      console.log('✓ "Ideas" sheet already exists');
    }

    // 시트 생성 요청 실행
    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests,
        },
      });
      console.log(`\n✅ Created ${requests.length} new sheet(s)!`);
    } else {
      console.log('\n✅ All required sheets already exist');
    }

    // 헤더 추가
    console.log('\n📝 Adding headers...');

    // Users 헤더
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A1:D1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['ID', 'Email', 'Password', 'Created At']],
      },
    });
    console.log('✓ Users headers added');

    // Ideas 헤더
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Ideas!A1:K1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['ID', 'User ID', 'Title', 'Content', 'Category', 'Mode', 'Probability', 'Keywords', 'Saved', 'Is Shared', 'Created At']],
      },
    });
    console.log('✓ Ideas headers added');

    // 헤더 행 서식 지정 (굵게, 배경색)
    console.log('\n🎨 Formatting headers...');

    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const usersSheetId = sheetInfo.data.sheets?.find(s => s.properties?.title === 'Users')?.properties?.sheetId;
    const ideasSheetId = sheetInfo.data.sheets?.find(s => s.properties?.title === 'Ideas')?.properties?.sheetId;

    const formatRequests = [];

    if (usersSheetId !== undefined) {
      formatRequests.push({
        repeatCell: {
          range: {
            sheetId: usersSheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 4,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: {
                red: 0.2,
                green: 0.4,
                blue: 0.8,
              },
              textFormat: {
                foregroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1,
                },
                bold: true,
              },
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)',
        },
      });
    }

    if (ideasSheetId !== undefined) {
      formatRequests.push({
        repeatCell: {
          range: {
            sheetId: ideasSheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 11,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: {
                red: 0.2,
                green: 0.4,
                blue: 0.8,
              },
              textFormat: {
                foregroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1,
                },
                bold: true,
              },
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat)',
        },
      });
    }

    if (formatRequests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: formatRequests,
        },
      });
      console.log('✓ Headers formatted');
    }

    console.log('\n🎉 Sheets setup completed successfully!');
    console.log('\nYou can view your spreadsheet at:');
    console.log(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
    console.log('\nNext step: Run migration');
    console.log('  npx tsx scripts/migrate-from-supabase.ts');

  } catch (error) {
    console.error('\n❌ Failed to create sheets:', error);
    process.exit(1);
  }
}

createSheets();
