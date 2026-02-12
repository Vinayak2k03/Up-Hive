# 🚀 Deployment Quick Start

**Everything is ready. Follow these 4 steps to go live.**

---

## Step 1️⃣ Deploy Frontend (Vercel)

```
1. Go to vercel.com → New Project → Import Git Repo
2. Select: Vinayak2k03/Up-Hive
3. Root Directory: apps/web
4. Environment Variables:
   - Copy ALL from your local apps/web/.env
   - Add them in Vercel UI
5. Click "Deploy"
6. ⏱️ Wait ~3 min
7. 📋 Copy your Vercel URL (e.g., https://up-hive.vercel.app)
```

---

## Step 2️⃣ Deploy API (Railway)

```
1. Go to railway.app → New Project → Deploy from GitHub
2. Select: Vinayak2k03/Up-Hive
3. New Service → Choose "api"
4. Configure:
   - Start Command: bun run apps/api/index.ts
   - Build Command: bun install && cd packages/db && bunx prisma generate
   - Port: 3001
5. Environment Variables:
   - Copy ALL from your local apps/api/.env
   - EXCEPT: Update FRONTEND_URL = <your Vercel URL from Step 1>
6. Deploy
7. ⏱️ Wait ~5 min
8. 📋 Copy your Railway API URL (appears in deployment)
```

---

## Step 3️⃣ Deploy Worker (Railway)

```
1. In same Railway project → New Service
2. Deploy from GitHub (same repo)
3. Choose "worker"
4. Configure:
   - Start Command: bun run apps/worker/index.ts
   - Build Command: bun install && cd packages/db && bunx prisma generate
5. Environment Variables:
   - Copy ALL from your local apps/worker/.env
6. Deploy
7. ⏱️ Wait ~5 min
```

---

## Step 4️⃣ Wire Up URLs

```
A) Update Vercel:
   1. Go to Vercel → Your Project → Settings → Environment Variables
   2. Update NEXT_PUBLIC_BACKEND_URL = <your Railway API URL from Step 2>
   3. Redeploy: vercel --prod

B) Update Railway API:
   1. Go to Railway → API Service → Variables
   2. Update FRONTEND_URL = <your Vercel URL from Step 1>
   3. Auto-restarts

C) Update Google OAuth:
   1. Go to console.cloud.google.com
   2. APIs & Services → Your OAuth Client
   3. Update Authorized redirect URIs:
      - Add: https://<your-vercel-url>/api/auth/callback/google
   4. Update Authorized JavaScript origins:
      - Add: https://<your-vercel-url>
```

---

## ✅ Test It!

```
1. Visit https://<your-vercel-url>
2. Click "Sign In" → Google Sign-In
3. Add a website to monitor
4. Check Railway Worker logs → should see processing
5. ✨ You're live!
```

---

## 🔐 Security Checklist

- ✅ `.env` files: Gitignored (not on GitHub)
- ✅ Vercel: Env vars set via UI (not in code)
- ✅ Railway: Env vars set via UI (not in code)
- ✅ GitHub: Only deployment guides, no secrets

---

## ⏱️ Total Time: ~40-50 minutes

- Frontend deployment: ~5 min
- API deployment: ~5 min  
- Worker deployment: ~5 min
- URL wiring: ~5 min
- Testing: ~5 min
- + Waiting times

---

**Questions?** Check `DEPLOYMENT_STEPS.md` for detailed instructions and troubleshooting.

**Ready?** Let's go! 🚀
