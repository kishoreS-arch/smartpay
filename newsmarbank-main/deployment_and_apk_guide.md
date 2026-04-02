# SmartPay Deployment & APK Walkthrough

This guide covers the finalized deployment of your bank application and the steps to build the Android APK using the new professional bank logo.

## 🏦 Brand Identity
We have generated and integrated a new professional bank logo for **SmartPay**.
![SmartPay Bank Logo](file:///c:/Users/kisho/Downloads/newsmarbank-main/newsmarbank-main/frontend/public/logo.png)

---

## 🚀 Part 1: Production Deployment

### 1. Backend Deployment (Render)
1. Sign in to [Render](https://render.com).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set **Build Command**: `cd backend && npm install`
5. Set **Start Command**: `cd backend && node server.js`
6. Add **Environment Variables**:
   - `JWT_SECRET`: (Generate a secure random string)
   - `MONGODB_URI`: (Your MongoDB Atlas connection string)
   - `FRONTEND_URL`: (Your final Vercel URL)

### 2. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com).
2. Import your repository.
3. Vercel will auto-detect Vite.
4. Add **Environment Variables**:
   - `VITE_API_URL`: (Your Render backend URL - e.g., `https://smartpay-api.onrender.com`)

---

## ⚡ Part 1.5: Unified Deployment (Fastest Method)
Instead of waiting for separate Git processes, you can deploy both with a single command from your terminal:

1. **Get your Render Deploy Hook**:
   - Go to [Render Dashboard](https://dashboard.render.com).
   - Go to **Settings** for your backend service.
   - Find **Deploy Hook** and copy the URL.
2. **Add to `.env` in root**:
   ```env
   RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxxx?key=yyyyyy
   ```
3. **Install Vercel CLI**:
   - `npm install -g vercel`
4. **Deploy Together**:
   - Run: `npm run deploy`
   - This script will simultaneously trigger a Render rebuild and a Vercel production build for the frontend.

---

## 📱 Part 2: Building the Android APK using PWABuilder.com (Preferred)

Instead of compiling locally with Android Studio, we've optimized `manifest.json` completely so you can instantly bundle your PWA into a Play Store-ready APK using Microsoft's free PWABuilder tool.

### 1. Requirements
- Your Vercel frontend URL: `https://frontend-dun-seven-oztwr7indp.vercel.app`
- A web browser.

### 2. Build Steps
1. Go to [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. Paste your Vercel URL into the input field and click **Start**.
3. PWABuilder will analyze your PWA. You will get a very high score because we've already included:
   - A valid `manifest.json` with maskable icons (`purpose: maskable`).
   - A registered Service Worker (`sw.js`) for offline capabilities.
   - All necessary theme colors and display modes.
4. Click **Package For Stores**.
5. Select **Android** and click **Generate Package**.
6. PWABuilder will bundle your web app using Bubblewrap (TWA - Trusted Web Activity) and provide you a ZIP file to download.

### 3. Locate your APK
After downloading the ZIP file from PWABuilder, extract it. Inside, you will find:
- Your `app-release.apk` (ready to transfer directly to your phone to install).
- An `.aab` file if you wish to publish to the Google Play Store.

---

## ✅ Final Checklist
- [x] Bank Logo Generated
- [x] Web Favicon Updated
- [x] Android Icons & Splash Screens Generated
- [x] Capacitor Platforms Initialized
- [x] Backend API Logic Verified

> [!TIP]
> You can open the project in Android Studio by running `npx cap open android` from the `frontend` directory. This allows you to run the app directly on an emulator or a physical phone for testing.
