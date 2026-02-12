# 🚀 Up-Hive Deployment Guide

All credentials are **safely stored in local `.env` files** (gitignored). They will **never be uploaded to GitHub**.

---

## ✅ Step 1: Verify Everything is Ready

```bash
cd /Users/vinayak/Desktop/My\ Projects/UpHive

# Check that .env files exist and are NOT in git
git ls-files | grep "\.env$"  # Should return nothing
ls apps/web/.env apps/api/.env apps/worker/.env packages/db/.env  # Should show all 4 exist
```

---

## 🔵 Step 2: Deploy Frontend to Vercel

### Option A: Via Vercel Web UI (Easiest)

1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. Click **Add New → Project**
3. Select **Import Git Repository** → Choose `Vinayak2k03/Up-Hive`
4. **Framework Preset**: Next.js ✓
5. **Root Directory**: `apps/web`
6. **Environment Variables** → Add these from your local `apps/web/.env`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   GOOGLE_CLIENT_ID=<from your .env>
   GOOGLE_CLIENT_SECRET=<from your .env>
   BETTER_AUTH_SECRET=<from your .env>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DATABASE_URL=<from your .env>
   DIRECT_URL=<from your .env>
   ```
7. Click **Deploy**
8. Once deployed, copy your Vercel URL (e.g., `https://up-hive.vercel.app`)

### Option B: Via Vercel CLI

```bash
cd apps/web
vercel login  # Authenticate with Vercel
vercel  # Deploy
# When asked about environment variables, add them from your local .env
```

---

## 🚂 Step 3: Deploy API to Railway

### Via Railway Web UI (Recommended)

1. Go to [railway.app](https://railway.app) → Sign up/Login
2. Click **New Project** → **Deploy from GitHub**
3. Select `Vinayak2k03/Up-Hive` repo
4. Create **New Service** named `api`
5. Configure:
   - **Start Command**: `bun run apps/api/index.ts`
   - **Build Command**: `bun install && cd packages/db && bunx prisma generate`
   - **Port**: `3001`

6. Go to **Variables** → Add from your local `apps/api/.env`:
   ```
   AMQP_URL=<from your .env>
   DATABASE_URL=<from your .env>
   DIRECT_URL=<from your .env>
   PORT=3001
   FRONTEND_URL=<your Vercel URL>
   EMAIL_USER=<from your .env>
   EMAIL_PASSWORD=<from your .env>
   MAIL_TO=<from your .env>
   NODE_ENV=production
   ```

7. Deploy
8. Copy your Railway API URL (e.g., `https://api-production.up.railway.app`)

---

## 🏭 Step 4: Deploy Worker to Railway

1. In the same Railway project, **New Service** → **Deploy from GitHub**
2. Same repo: `Vinayak2k03/Up-Hive`
3. Configure:
   - **Start Command**: `bun run apps/worker/index.ts`
   - **Build Command**: `bun install && cd packages/db && bunx prisma generate`

4. Go to **Variables** → Add from your local `apps/worker/.env`:
   ```
   DATABASE_URL=<from your .env>
   DIRECT_URL=<from your .env>
   AMQP_URL=<from your .env>
   EMAIL_USER=<from your .env>
   EMAIL_PASSWORD=<from your .env>
   REDIS_URL=<from your .env>
   NODE_ENV=production
   ```

5. Deploy

---

## 🔗 Step 5: Wire Up Live URLs

Now update services to know about each other:

### Update Vercel Environment Variables

1. Go to Vercel → Your Project → **Settings** → **Environment Variables**
2. Update:
   - `NEXT_PUBLIC_BACKEND_URL` = `https://api-production.up.railway.app` (your Railway API URL)
   - `NEXT_PUBLIC_APP_URL` = `https://up-hive.vercel.app` (your Vercel URL)
3. Redeploy: `vercel --prod`

### Update Railway API Environment Variables

1. Go to Railway → API Service → **Variables**
2. Update:
   - `FRONTEND_URL` = `https://up-hive.vercel.app` (your Vercel URL)
3. Service will auto-restart

---

## 🔒 Step 6: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials** → Your OAuth Client
3. Update **Authorized redirect URIs**:
   - Add: `https://up-hive.vercel.app/api/auth/callback/google`
   - Remove: `http://localhost:3000/api/auth/callback/google`

4. Update **Authorized JavaScript origins**:
   - Add: `https://up-hive.vercel.app`
   - Remove: `http://localhost:3000`

---

## ✨ Step 7: Test Everything

1. **Frontend**: Visit `https://up-hive.vercel.app`
2. **Sign In**: Click Google Sign-In → should work
3. **Add Website**: Create a test website to monitor
4. **Check Worker**: Railway Worker logs should show it's processing queue messages
5. **Check Redis**: Upstash dashboard should show activity

---

## 📋 Checklist

- [ ] Database migrations applied ✅ (already done)
- [ ] Code pushed to GitHub ✅ (already done, no secrets)
- [ ] Frontend deployed to Vercel
- [ ] API deployed to Railway
- [ ] Worker deployed to Railway
- [ ] Live URLs wired up
- [ ] Google OAuth updated
- [ ] All services talking to each other

---

## 🚨 Important: Keeping Secrets Safe

✅ **What's protected:**
- `.env` files are in `.gitignore` — never tracked in git
- All credentials stay on your machine
- Deployed services get env vars via platform dashboards only
- No secrets in code, Docker images, or GitHub

⚠️ **What to avoid:**
- Never paste secrets into GitHub Issues or PRs
- Never commit `.env` files
- Never expose `packages/db/.env` or `apps/*/​.env`

---

## 🆘 Troubleshooting

**Frontend not loading API?**
- Check `NEXT_PUBLIC_BACKEND_URL` matches Railway API URL
- Check CORS in `apps/api/index.ts` includes your Vercel domain

**Worker not processing messages?**
- Check `AMQP_URL` and `REDIS_URL` in Railway Variables
- Check worker logs: `railway logs --service worker`

**Database connection fails?**
- Verify `DATABASE_URL` (pooled) and `DIRECT_URL` are correct
- Check Neon console — compute might be suspended

**Google Sign-In fails?**
- Check redirect URIs are updated in Google Cloud Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` match

---

## 📞 Need Help?

All services have built-in health checks:
- API: `GET https://api-production.up.railway.app/` → `{"message":"Healthy Server"}`
- Worker: Check logs in Railway dashboard
- Frontend: Check browser console for errors
