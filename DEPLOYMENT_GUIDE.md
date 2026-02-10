# End-to-End Deployment Guide for Up-Hive

Your project is now ready for production deployment! This guide walks you through deploying to Railway (API + Worker) and Vercel (Frontend).

## ✅ Pre-Deployment Checklist

- [x] Code changes applied and tested locally
- [x] All environment variables configured
- [x] Database migrations ready (Neon)
- [x] Message queue ready (CloudAMQP)
- [x] Redis configured (Upstash)
- [x] Google OAuth credentials obtained
- [ ] GitHub repository pushed (do this first!)
- [ ] Railway account created
- [ ] Vercel account created

---

## 🚀 Step 1: Push to GitHub

Your code must be on GitHub for Railway and Vercel to access it.

```bash
cd "/Users/vinayak/Desktop/My Projects/UpHive"
git push origin main
```

If you haven't set up GitHub yet:
```bash
git remote add origin https://github.com/Vinayak2k03/Up-Hive.git
git branch -M main
git push -u origin main
```

---

## 🚀 Step 2: Deploy API + Worker to Railway

### 2a. Install Railway CLI

```bash
npm i -g @railway/cli
railway login
```

### 2b. Deploy API Service

```bash
cd "/Users/vinayak/Desktop/My Projects/UpHive"
railway init
railway service create api
```

When prompted:
- Select your GitHub repository
- Choose the `main` branch
- Set root directory to `.` (current directory)

**Configure in Railway Dashboard:**

1. Go to [railway.app](https://railway.app)
2. Select the "api" service
3. Go to **Settings** → **Environment**
4. Add these environment variables:

```
DATABASE_URL=postgresql://neondb_owner:REDACTED_DB_PASSWORD@ep-solitary-resonance-aiersj7u-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://neondb_owner:REDACTED_DB_PASSWORD@ep-solitary-resonance-aiersj7u.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
AMQP_URL=amqps://REDACTED_AMQP_USER:REDACTED_AMQP_PASSWORD@lionfish.rmq.cloudamqp.com/REDACTED_AMQP_USER
PORT=3001
FRONTEND_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
EMAIL_USER=REDACTED_EMAIL
EMAIL_PASSWORD=REDACTED_GMAIL_APP_PASSWORD
MAIL_TO=REDACTED_EMAIL
NODE_ENV=production
```

5. Go to **Settings** → **Build**
   - Build Command: `cd apps/api && bun install`
   - Start Command: `cd apps/api && bun run index.ts`

6. Click **Deploy** and copy your API URL (e.g., `https://uphive-api.railway.app`)

### 2c. Deploy Worker Service

1. In Railway, click **New Service**
2. Select your GitHub repository
3. Create "worker" service
4. Set Build & Start commands same as API but for worker:
   - Build Command: `cd apps/worker && bun install`
   - Start Command: `cd apps/worker && bun run index.ts`

5. Add environment variables (same as API, except):

```
DATABASE_URL=postgresql://neondb_owner:REDACTED_DB_PASSWORD@ep-solitary-resonance-aiersj7u-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://neondb_owner:REDACTED_DB_PASSWORD@ep-solitary-resonance-aiersj7u.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
AMQP_URL=amqps://REDACTED_AMQP_USER:REDACTED_AMQP_PASSWORD@lionfish.rmq.cloudamqp.com/REDACTED_AMQP_USER
EMAIL_USER=REDACTED_EMAIL
EMAIL_PASSWORD=REDACTED_GMAIL_APP_PASSWORD
REDIS_URL=rediss://default:REDACTED_REDIS_PASSWORD@REDACTED_REDIS_HOST:6379
NODE_ENV=production
```

---

## 🚀 Step 3: Deploy Frontend to Vercel

### 3a. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Set **Root Directory** to `apps/web`

### 3b. Configure Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_BACKEND_URL=https://your-api-railway-url.railway.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
BETTER_AUTH_SECRET=REDACTED_AUTH_SECRET
GOOGLE_CLIENT_ID=REDACTED_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=REDACTED_GOOGLE_SECRET
DATABASE_URL=postgresql://neondb_owner:REDACTED_DB_PASSWORD@ep-solitary-resonance-aiersj7u-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://neondb_owner:REDACTED_DB_PASSWORD@ep-solitary-resonance-aiersj7u.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3c. Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Edit the OAuth 2.0 Client ID
5. Add authorized origins:
   - `https://your-app.vercel.app`
6. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`

### 3d. Deploy

Click **Deploy** on Vercel. It will automatically build and deploy.

---

## 📋 What You Need to Provide/Configure

### You Must Do:

1. **GitHub Setup** ✋
   - Push code to `https://github.com/Vinayak2k03/Up-Hive`

2. **Update Vercel URLs** ✋
   - After Vercel deployment, you'll get a URL like `https://uphive-xyz.vercel.app`
   - Update the `FRONTEND_URL` in Railway API with this URL
   - Update Google OAuth redirect URIs with this URL

3. **Update Railway API URL** ✋
   - After Railway API deployment, you'll get a URL
   - Update `NEXT_PUBLIC_BACKEND_URL` in Vercel with this URL

4. **Google OAuth** ✋
   - Update redirect URIs in Google Cloud Console:
     - Authorized JavaScript origins: `https://your-vercel-app.vercel.app`
     - Authorized redirect URIs: `https://your-vercel-app.vercel.app/api/auth/callback/google`

### Already Configured:

- ✅ Neon Database (connections ready)
- ✅ CloudAMQP RabbitMQ (AMQP URL set)
- ✅ Upstash Redis (Redis URL set)
- ✅ Gmail Email (credentials configured)
- ✅ Better Auth Secret (generated)
- ✅ All code fixes applied

---

## 🔗 Deployment Summary

```
┌─────────────────────────────────────────────┐
│ Frontend (Vercel)                           │
│ https://your-app.vercel.app                 │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│ API (Railway)                               │
│ https://uphive-api.railway.app              │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┼─────────┐
        ↓         ↓         ↓
   ┌────────┐ ┌────────┐ ┌─────────┐
   │ Neon   │ │CloudAMQP│ │ Upstash │
   │ DB     │ │ Queue  │ │ Redis   │
   └────────┘ └────────┘ └─────────┘
        │         │
        └─────────┼─────────┐
                  ↓         ↓
        ┌─────────────────────────────┐
        │ Worker (Railway)            │
        │ Processes monitoring jobs   │
        │ Sends email notifications   │
        └─────────────────────────────┘
```

---

## 🧪 Post-Deployment Testing

### Test 1: Health Check API
```bash
curl https://your-api-railway-url.railway.app/
# Should return: {"message":"Healthy Server"}
```

### Test 2: Access Frontend
- Open `https://your-app.vercel.app`
- You should see the login page

### Test 3: Test Google Sign In
- Click "Sign in with Google"
- You should be redirected to Google OAuth
- After login, you should be redirected back to dashboard

### Test 4: Add a Website
- Add a test website (e.g., https://google.com)
- Check Railway worker logs to see monitoring start
- Wait a few minutes for a status update

### Test 5: Check Email Notification
- Manually trigger a "down" status in the database
- Check your Gmail inbox for notification email

---

## 🔧 Troubleshooting

### API returning 500 errors
- Check Railway API logs
- Verify DATABASE_URL is correct
- Ensure AMQP_URL is accessible

### Worker not processing messages
- Check Railway worker logs
- Verify REDIS_URL format (should start with `rediss://`)
- Check CloudAMQP queue in dashboard

### Login not working
- Check browser console for errors
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check Google OAuth redirect URIs are correct
- Verify BETTER_AUTH_SECRET is set

### Emails not sending
- Check Gmail App Password is correct
- Verify "Less secure app access" is enabled in Gmail
- Check worker logs for email queue errors

---

## 📊 Cost Breakdown (Monthly)

- **Neon**: Free (512MB storage)
- **CloudAMQP**: Free (3M messages/month)
- **Upstash Redis**: Free (10K commands/day)
- **Vercel**: Free (hobby tier)
- **Railway**: $5/month (after free trial)
- **Gmail**: Free

**Total: ~$5/month**

---

## 🎯 Next Steps

1. Push code to GitHub
2. Create Railway account
3. Create Vercel account
4. Deploy API to Railway
5. Deploy Worker to Railway
6. Deploy Frontend to Vercel
7. Update environment variables
8. Test all functionality
9. Monitor logs for any issues

---

## 📞 Need Help?

- Railway Docs: https://railway.app/docs
- Vercel Docs: https://vercel.com/docs
- Better Auth: https://www.better-auth.com
- Neon: https://neon.tech/docs
