const { execSync } = require('child_process');
require('dotenv').config();

const RENDER_DEPLOY_HOOK = process.env.RENDER_DEPLOY_HOOK;

/**
 * SmartPay: Unified Deployment Script
 * -----------------------------------
 * This script automates the deployment of both the Frontend (Vercel) and Backend (Render).
 * It uses the Vercel CLI for the frontend and a Render Deploy Hook for the backend.
 */

async function deploy() {
  console.log('🚀 Starting Unified Deployment...');

  // 1. Deploy Backend (via Render Deploy Hook)
  if (RENDER_DEPLOY_HOOK) {
    console.log('📦 Triggering Render Backend Deployment...');
    try {
      // Using fetch (Node.js 18+) or a quick curl command
      const response = await fetch(RENDER_DEPLOY_HOOK, { method: 'POST' });
      if (response.ok) {
        console.log('✅ Render deployment triggered successfully!');
      } else {
        console.error('❌ Failed to trigger Render deployment:', response.statusText);
      }
    } catch (error) {
      console.warn('⚠️ Could not trigger Render hook. Make sure you have RENDER_DEPLOY_HOOK in your root .env');
      console.log('Trying curl as fallback...');
      try {
        execSync(`curl -X POST ${RENDER_DEPLOY_HOOK}`, { stdio: 'inherit' });
        console.log('✅ Render deployment triggered via curl!');
      } catch (e) {
        console.error('❌ Error triggering Render:', e.message);
      }
    }
  } else {
    console.log('⏭️ Skipping Render: RENDER_DEPLOY_HOOK not found in .env');
    console.log('To automate Render, go to Render Dashboard > Settings > Deploy Hook and copy the URL.');
  }

  // 2. Deploy Frontend (via Vercel CLI)
  console.log('\n📦 Starting Vercel Frontend Deployment...');
  try {
    console.log('Installing Vercel CLI if missing...');
    // execSync('npm install -g vercel', { stdio: 'inherit' }); // Slow, assume it's installed or they use npx
    
    console.log('Running Vercel deployment...');
    // --prod skips confirmation and deploys immediately
    // --yes/--confirm to bypass interactive prompts if any
    execSync('npx vercel --prod --yes --cwd frontend', { stdio: 'inherit' });
    console.log('✅ Vercel deployment successful!');
  } catch (error) {
    console.error('❌ Vercel deployment failed. Ensure you are logged in: npx vercel login');
    console.error(error.message);
  }

  console.log('\n✨ Deployment process finished.');
}

deploy();
