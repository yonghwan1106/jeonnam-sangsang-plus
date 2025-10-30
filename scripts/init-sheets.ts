#!/usr/bin/env tsx
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { initializeSheets } from '../lib/google-sheets';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

async function main() {
  console.log('🚀 Initializing Google Sheets...\n');

  try {
    await initializeSheets();
    console.log('✅ Google Sheets initialized successfully!');
    console.log('\nSheets created:');
    console.log('  - Users: ID, Email, Password, Created At');
    console.log('  - Ideas: ID, User ID, Title, Content, Category, Mode, Probability, Keywords, Saved, Is Shared, Created At');
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets:', error);
    process.exit(1);
  }
}

main();
