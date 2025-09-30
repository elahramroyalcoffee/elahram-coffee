# Vercel Login Issue Troubleshooting Guide

## Problem: Login works locally but fails on Vercel with "Invalid credentials"

## Most Common Causes & Solutions

### 1. 🔐 **Password Hash Compatibility Issue** (Most Likely)

Your admin user's password might not be properly hashed or the hash format is incompatible.

**Solution:**

1. Test your current admin user password:

   ```bash
   # Visit your deployed site
   https://your-app.vercel.app/api/admin-fix

   # Check current admin status
   POST to /api/admin-fix with:
   {
     "action": "check",
     "email": "your-admin-email@example.com"
   }
   ```

2. If password format is wrong, fix it:
   ```bash
   POST to /api/admin-fix with:
   {
     "action": "fix",
     "email": "your-admin-email@example.com",
     "password": "your-new-password"
   }
   ```

### 2. 🌐 **Environment Variables Missing/Wrong**

**Check these in Vercel Dashboard → Settings → Environment Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NODE_ENV=production (auto-set by Vercel)
```

**Test connection:**
Visit: `https://your-app.vercel.app/api/debug-auth` (GET request)

### 3. 🗄️ **Wrong Supabase Database/Project**

You might be connecting to a different Supabase project in production.

**Verify:**

- Check that SUPABASE_URL points to the same project as local
- Ensure your admin user exists in the production database
- Confirm the `users` table structure matches

### 4. 🔒 **Cookie/Security Issues**

Production uses HTTPS which affects cookie behavior.

**Already Fixed in Code:**

- `secure: process.env.NODE_ENV === "production"` ✅
- `sameSite: "lax"` ✅
- `httpOnly: true` ✅

## Step-by-Step Debugging

### Step 1: Check Environment

```bash
curl https://your-app.vercel.app/api/debug-auth
```

### Step 2: Test Login Credentials

```bash
curl -X POST https://your-app.vercel.app/api/debug-auth \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}'
```

### Step 3: Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Check logs for any errors

### Step 4: Fix Admin Password (if needed)

```javascript
// Using browser console on your deployed site
fetch("/api/admin-fix", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "fix",
    email: "your-admin-email@example.com",
    password: "your-new-password",
  }),
})
  .then((r) => r.json())
  .then(console.log);
```

## Quick Fix Commands

### For Local Testing:

```bash
npm run dev
# Check console logs when logging in
```

### For Production Debugging:

1. **Check Environment Variables**
2. **Re-create Admin User** (most common fix)
3. **Check Supabase Connection**

## Expected Console Output (with debug logs):

```
🔐 Sign in attempt for: admin@example.com
🌍 Environment: production
🔗 Supabase URL: https://abc123...
✅ Supabase connection successful
👤 User query result: { found: true }
🔍 Found user: { id: 1, email: "admin@example.com" }
🔐 Comparing passwords...
🔐 Password match result: true
✅ Authentication successful
```

## Remove Debug Logs Later

After fixing, remove debug logs by replacing the signInAction with the original version without console.log statements.

## Most Likely Solution

**Re-create your admin user in production** with a properly hashed password using the `/api/admin-fix` endpoint.
