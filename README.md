# 📒 HisabKitab — Setup Guide

Full-stack Next.js app for micro-entrepreneurs. Built for MumbaiHacks 2024.

## ✅ Features
1. **Dashboard** — Today's earnings, monthly total, pending payments, weekly chart
2. **1-Click WhatsApp Reminders** — Send payment reminders via Twilio in 7 Indian languages
3. **Multi-Language Templates** — English, Hindi, Marathi, Tamil, Telugu, Gujarati, Bengali
4. **Restock Alerts** — Visual warnings when inventory falls below threshold
5. **Authentication** — Google OAuth + Email/Password via NextAuth

---

## 🚀 Step-by-Step Setup

### Step 1 — Prerequisites
Make sure you have these installed:
```bash
node --version   # Should be 18+
npm --version    # Should be 9+
```
If not installed, download Node.js from https://nodejs.org

---

### Step 2 — Create the Next.js Project
```bash
npx create-next-app@latest hisabkitab
```
When prompted:
- TypeScript? → **No**
- ESLint? → **Yes**
- Tailwind CSS? → **Yes**
- `src/` directory? → **Yes**
- App Router? → **Yes**
- Import alias? → **Yes** (keep default `@/*`)

Then replace all the generated files with the ones from this project.

OR if you already have this folder:
```bash
cd hisabkitab
npm install
```

---

### Step 3 — Install Dependencies
```bash
npm install next-auth mongoose bcryptjs twilio node-cron recharts lucide-react date-fns
npm install --save-dev @types/bcryptjs
```

---

### Step 4 — MongoDB Setup (Free)
1. Go to https://cloud.mongodb.com and sign up free
2. Create a new **Project**
3. Create a **Cluster** (choose M0 Free tier)
4. Click **Connect** → **Connect your application**
5. Copy the connection string — looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```
6. Replace `<password>` with your actual password
7. Add `/hisabkitab` at the end (this is your database name):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hisabkitab
   ```

**Allow connections from anywhere (for dev):**
- In Atlas, go to **Network Access** → **Add IP Address** → **Allow Access from Anywhere**

---

### Step 5 — Google OAuth Setup (for "Continue with Google")
1. Go to https://console.cloud.google.com
2. Create a new project (or use existing)
3. Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** → Fill in app name, email → Save
4. Go to **Credentials** → **Create Credentials** → **OAuth Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret**

---

### Step 6 — Twilio Setup (for WhatsApp)
1. Go to https://console.twilio.com and sign up free
2. In the console, find your **Account SID** and **Auth Token**
3. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
4. Note your **Sandbox number** (usually +14155238886) and your **sandbox keyword**
5. For testing: Have your customers send `join <keyword>` to the sandbox number on WhatsApp

---

### Step 7 — Create Environment File
```bash
cp .env.example .env.local
```

Now open `.env.local` and fill in your values:

```env
# MongoDB
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/hisabkitab

# NextAuth
NEXTAUTH_SECRET=run_this_to_generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

To generate NEXTAUTH_SECRET, run in terminal:
```bash
openssl rand -base64 32
```

---

### Step 8 — Run the App
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📁 Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js   ← NextAuth handler
│   │   │   └── register/route.js        ← Email signup
│   │   ├── dashboard/route.js           ← Dashboard stats
│   │   ├── customers/route.js           ← Customer CRUD
│   │   ├── orders/route.js              ← Order CRUD
│   │   ├── inventory/route.js           ← Inventory CRUD
│   │   └── whatsapp/send/route.js       ← Twilio sender
│   ├── auth/signin/page.js              ← Login/Register page
│   ├── dashboard/
│   │   ├── page.js                      ← Main dashboard
│   │   ├── customers/page.js            ← Customers list
│   │   ├── orders/page.js               ← Orders
│   │   ├── inventory/page.js            ← Inventory + alerts
│   │   └── whatsapp/page.js             ← 1-click reminders
│   ├── layout.js
│   ├── page.js                          ← Landing page
│   └── providers.js
├── components/
│   └── dashboard/DashboardNav.js        ← Sidebar nav
├── lib/
│   ├── auth.js                          ← NextAuth config
│   ├── mongodb.js                       ← DB connection
│   └── whatsappTemplates.js             ← All language templates
└── models/
    ├── User.js
    ├── Customer.js
    └── Order.js                         ← Also exports Inventory model
```

---

## 🧪 Testing WhatsApp (Twilio Sandbox)
1. Open WhatsApp on your phone
2. Send a message to **+1 415 523 8886**
3. Message content: `join <your-sandbox-keyword>` (find keyword in Twilio console)
4. You'll get a confirmation message
5. Now go to HisabKitab → Add a customer with your phone number → Send reminder!

---

## 🐛 Common Issues

**MongoDB connection error:**
- Check your connection string is correct
- Make sure your IP is whitelisted in Atlas Network Access

**Google OAuth not working:**
- Make sure `NEXTAUTH_URL=http://localhost:3000` exactly matches
- Make sure `http://localhost:3000/api/auth/callback/google` is in your Google authorized redirect URIs

**WhatsApp not sending:**
- Make sure the customer joined your Twilio sandbox first
- Phone number must include country code: `+919876543210`

**`useSession` error:**
- Make sure you're on a page inside the `(dashboard)` layout or wrapped in `<Providers>`

---

## 🚢 Deploy to Vercel (5 minutes)
```bash
npm install -g vercel
vercel
```
- Add all env variables in Vercel dashboard → Settings → Environment Variables
- Update Google OAuth redirect URI to your Vercel URL
- Update `NEXTAUTH_URL` to your Vercel URL

---

## 🏆 Hackathon Tips
- For the demo: pre-create 2-3 sample customers with pending amounts
- Show the WhatsApp reminder live — it's the most impressive feature
- Show the dashboard stats with some dummy orders added
- Highlight the multi-language feature — very unique for Indian market
