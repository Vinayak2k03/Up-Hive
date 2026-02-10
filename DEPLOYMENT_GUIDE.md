# 🚀 Up-Hive Deployment Guide

## Architecture

- **Frontend**: Vercel (Next.js)
- **API**: Railway (Express/Bun)
- **Worker**: Railway (Bun)
- **Database**: Neon PostgreSQL
- **Queue**: CloudAMQP (RabbitMQ)
- **Cache**: Upstash Redis
- **Email**: Gmail SMTP

## Prerequisites

1. [Neon](https://neon.tech) account — create a PostgreSQL database
2. [CloudAMQP](https://cloudamqp.com) account — create a RabbitMQ instance
3. [Upstash](https://upstash.com) account — create a Redis database
4. [Google Cloud Console](https://console.cloud.google.com) — create OAuth 2.0 credentials
5. Gmail account with [App Password](https://myaccount.google.com/apppasswords)

## Step 1: Push Code to GitHub

```bash
git push origin main
```

## Step 2: Deploy API to Railway

1. Go to [railway.app](https://railway.app) and sign up
2. New Project → Import GitHub Repo
3. Create "api" service with:
   - **Build Command**: `cd apps/api && bun install`
   - **Start Command**: `cd apps/api && bun run index.ts`

4. Add environment variables:
```
DATABASE_URL=<your-neon-pooled-connection-url>
DIRECT_URL=<your-neon-direct-connection-url>
AMQP_URL=<your-cloudamqp-url>
PORT=3001
FRONTEND_URL=<your-vercel-domain>
EMAIL_USER=<your-gmail-address>
EMAIL_PASSWORD=<your-gmail-app-password>
MAIL_TO=<your-admin-email>
NODE_ENV=production
```

5. Deploy and copy the API URL

## Step 3: Deploy Worker to Railway

1. In the same Railway project, create a new "worker" service
2. Configure:
   - **Build Command**: `cd apps/worker && bun install`
   - **Start Command**: `cd apps/worker && bun run index.ts`

3. Add environment variables:
```
DATABASE_URL=<your-neon-pooled-connection-url>
DIRECT_URL=<your-neon-direct-connection-url>
AMQP_URL=<your-cloudamqp-url>
EMAIL_USER=<your-gmail-address>
EMAIL_PASSWORD=<your-gmail-app-password>
REDIS_URL=<your-upstash-redis-url>
NODE_ENV=production
```

4. Deploy

## Step 4: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. New Project → Import GitHub Repo
3. Set **Root Directory**: `apps/web`
4. Add environment variables:
```
NEXT_PUBLIC_BACKEND_URL=<your-railway-api-url>
NEXT_PUBLIC_APP_URL=<your-vercel-domain>
BETTER_AUTH_SECRET=<generate-with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
DATABASE_URL=<your-neon-pooled-connection-url>
DIRECT_URL=<your-neon-direct-connection-url>
```

5. Deploy

## Step 5: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials → Edit OAuth Client
3. Add to **Authorized JavaScript origins**:
   - `https://your-app.vercel.app`
4. Add to **Authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/callback/google`

## Step 6: Update Railway API

1. Go to Railway → API service → Environment
2. Update `FRONTEND_URL` to your Vercel domain
3. Redeploy

## Step 7: Test

1. Visit your Vercel domain
2. Sign in with Google
3. Add a website to monitor
4. Check Railway worker logs for monitoring activity

## Post-Deployment

- Monitor Railway logs for API and Worker
- Check CloudAMQP dashboard for queue health
- Check Upstash dashboard for Redis activity

## Cost Estimate

| Service | Cost |
|---------|------|
| Neon | Free (512MB) |
| CloudAMQP | Free (3M msg/mo) |
| Upstash | Free (10K cmd/day) |
| Vercel | Free (hobby) |
| Railway | ~$5/mo |
| **Total** | **~$5/month** |

## Troubleshooting

- **API not responding**: Check Railway logs, verify DATABASE_URL
- **Worker not processing**: Check REDIS_URL (must use `rediss://` for Upstash), check AMQP_URL
- **Login not working**: Verify Google OAuth redirect URIs, check BETTER_AUTH_SECRET is set
- **Emails not sending**: Verify Gmail App Password, check worker logs
