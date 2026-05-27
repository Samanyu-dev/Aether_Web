# Google OAuth Integration Setup Guide for Aether Observability Platform

This guide provides step-by-step instructions to configure **Google OAuth** authentication for your **Aether Platform** instance using Google Cloud Console and Supabase.

---

## 🛠️ Step 1: Create OAuth Credentials on Google Cloud Console

1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown in the top navigation bar and select **New Project**. Name it `Aether Platform` (or your preferred name) and click **Create**.
3. In the left navigation sidebar, go to **APIs & Services** > **OAuth consent screen**:
   - Choose **External** user type and click **Create**.
   - Fill in the required **App Information** (e.g., App Name: `Aether Observability`, User Support Email: `your-email@domain.com`).
   - Leave the other fields default, scroll to the bottom, and click **Save and Continue** until you return to the Dashboard.
4. Go to **APIs & Services** > **Credentials**:
   - Click **+ Create Credentials** at the top and select **OAuth client ID**.
   - Set **Application Type** to `Web application`.
   - Set **Name** to `Aether Web App`.
   - In the **Authorized JavaScript origins** section, add your local and production endpoints:
     - `http://localhost:3000`
     - `https://your-aether-deployment.vercel.app` (if applicable)
   - In the **Authorized redirect URIs** section, add the Supabase Auth Callback endpoint:
     - `https://mmxpmeccczijvrsgvsdz.supabase.co/auth/v1/callback`
5. Click **Create** to generate your client keys.
6. A popup will display your **Client ID** and **Client Secret**. Copy these safely!

---

## 🔒 Step 2: Configure Supabase Auth Provider

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project (`Aether Web` / ID: `mmxpmeccczijvrsgvsdz`).
3. In the left sidebar, navigate to **Authentication** > **Providers**.
4. Scroll down and expand the **Google** provider accordion:
   - Toggle **Google Enabled** to **ON**.
   - Paste the **Client ID** copied from GCP in Step 1.
   - Paste the **Client Secret** copied from GCP in Step 1.
5. Click **Save** at the bottom of the accordion.

---

## 🚀 Step 3: Run and Test Locally

1. Restart your local development server if running:
   ```bash
   npm run dev
   ```
2. Navigate to [http://localhost:3000/login](http://localhost:3000/login).
3. Click the **Continue with Google** button. You will be successfully redirected to the secure Google OAuth login window.
4. After signing in, you will be seamlessly authenticated and redirected back to your dynamic Developer Dashboard.

---

## 💡 Developer Local-First Simulation Mode

If you are running offline or want to bypass OAuth configuration during local testing:
*   Click **Continue with Google** on the login screen.
*   A custom popup will ask if you want to **Launch Local Demo Mock Session**.
*   Select it to instantiate a virtual developer user profile immediately, complete with full feature parity and analytics history!
