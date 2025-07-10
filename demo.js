#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up OhMyGerd demo mode...\n');

// Backup original hooks
const authHookPath = path.join(__dirname, 'src/hooks/useAuth.ts');
const trackingHookPath = path.join(__dirname, 'src/hooks/useTracking.ts');
const authDemoPath = path.join(__dirname, 'src/hooks/useAuth.demo.ts');
const trackingDemoPath = path.join(__dirname, 'src/hooks/useTracking.demo.ts');

const authBackupPath = path.join(__dirname, 'src/hooks/useAuth.original.ts');
const trackingBackupPath = path.join(__dirname, 'src/hooks/useTracking.original.ts');

try {
  // Backup originals if they don't exist
  if (!fs.existsSync(authBackupPath) && fs.existsSync(authHookPath)) {
    fs.copyFileSync(authHookPath, authBackupPath);
    console.log('✅ Backed up original useAuth.ts');
  }
  
  if (!fs.existsSync(trackingBackupPath) && fs.existsSync(trackingHookPath)) {
    fs.copyFileSync(trackingHookPath, trackingBackupPath);
    console.log('✅ Backed up original useTracking.ts');
  }

  // Replace with demo versions
  if (fs.existsSync(authDemoPath)) {
    fs.copyFileSync(authDemoPath, authHookPath);
    console.log('✅ Activated demo useAuth hook');
  }
  
  if (fs.existsSync(trackingDemoPath)) {
    fs.copyFileSync(trackingDemoPath, trackingHookPath);
    console.log('✅ Activated demo useTracking hook');
  }

  console.log('\n🎉 Demo mode activated!');
  console.log('📱 The app now works with mock data and no backend required.');
  console.log('🔧 Run "npm run dev" to start the development server.');
  console.log('💡 All features are functional with simulated data.');
  
} catch (error) {
  console.error('❌ Error setting up demo mode:', error.message);
  process.exit(1);
}