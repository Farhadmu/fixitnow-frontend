# FixItNow — Frontend 🔧
**"Your Trusted Home Service Platform"**

Assignment 5 (Programming Hero) — Next.js 14 (App Router) + TypeScript frontend for the FixItNow home service marketplace, consuming the [FixItNow backend API](https://github.com/Farhadmu/FixItNow).

🔗 **Live App:** https://fixitnow-frontend-wki2.onrender.com/
🔗 **Live API:** https://fixitnow-2a0m.onrender.com/api

---

## 1. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS — custom "job ticket / blueprint workshop" design system |
| Forms & Validation | React Hook Form + Zod |
| Server State | TanStack Query (React Query) |
| Auth State | React Context (`AuthProvider`) |
| Route Protection | Next.js Middleware (role-based, reads JWT from cookies) |
| Payments | Stripe Checkout redirect flow |
| Charts | Recharts (earnings trend, bookings-by-status analytics) |
| Notifications | `sonner` toasts |

---

## 2. Features

### Public
- Responsive service & technician grid with search, category, location, and price filters
- Sticky filter bar with live result counts
- Global search bar in the navbar
- Technician profile pages with bio, services, weekly availability, and reviews
- Interactive booking form (service + date/time + address)
- Pagination on all browse pages
- Skeleton loaders and scoped `loading.tsx` / `error.tsx` per route segment

### Customer
- Registration/login with Zod-validated forms and inline field errors
- Booking history with a **visual status stepper** (Requested → Accepted → Paid → In Progress → Completed)
- Stripe Checkout payment flow with dedicated `/payment/success` and `/payment/cancel` pages
- Payment history table
- Cancel booking (only while eligible) and leave a review after completion

### Technician
- Dashboard overview with stats + **earnings trend chart**
- Weekly **calendar-grid availability scheduler** (click a day to add/remove time blocks)
- Profile and services management (create/edit/delete)
- Booking management table with Accept / Decline / Start / Complete actions and the same status stepper

### Admin
- Platform stats (total users, active bookings, revenue) + **bookings-by-status chart**
- User management table with search, role/status filters, pagination, and ban/unban
- Full category CRUD (create, edit, delete)

---

## 3. 🖥️ Run Locally in VS Code

### Step 1 — Prerequisites
- Node.js v18+
- VS Code
- The FixItNow backend already deployed (or running locally)

### Step 2 — Install
```bash
npm install
```

### Step 3 — Environment variables
```bash
cp .env.example .env.local
```
```
NEXT_PUBLIC_API_URL=https://fixitnow-2a0m.onrender.com/api
```

### Step 4 — Run
```bash
npm run dev
```
Visit http://localhost:3000

### Step 5 — Point the backend's Stripe redirect at this app
In the **backend's** environment variables (Render), set:
```
CLIENT_URL=http://localhost:3000
```
while developing locally, or to the live frontend URL once deployed — otherwise Stripe redirects land in the wrong place after checkout.

---

## 4. 🧪 Testing the full flow

1. Register a **Customer** and a **Technician** from `/register`.
2. As Technician → `/dashboard/technician/profile` → fill profile, set weekly availability, add a service.
3. As Customer → browse `/services` or `/technicians` → open a profile → submit a booking.
4. As Technician → `/dashboard/technician/bookings` → **Accept**.
5. As Customer → `/dashboard/customer` → **Pay now** → Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC → redirected to `/payment/success`.
6. As Technician → **Start job**, then **Mark completed**.
7. As Customer → **Leave review**.
8. As Admin (`admin@fixitnow.com` / `Admin123!`) → `/dashboard/admin` to ban/unban users, view analytics, and `/dashboard/admin/categories` to manage categories.

---

## 5. 🚀 Deployment

This app is deployed on **Render** as a Node.js web service.

**Build Command:**
```
npm install && npm run build
```
**Start Command:**
```
npm start
```
**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://fixitnow-2a0m.onrender.com/api
```

> ⚠️ After deploying (or redeploying), make sure the **backend's** `CLIENT_URL` environment variable points to this frontend's live URL (`https://fixitnow-frontend-wki2.onrender.com`), so Stripe redirects land correctly after checkout.

> ℹ️ Render's free tier spins down after inactivity — the first request after idle time may take 30–50 seconds to wake up (both frontend and backend).

Alternative: deploy to [Vercel](https://vercel.com/new) (auto-detects Next.js, no build command needed) — just import the repo and add the same `NEXT_PUBLIC_API_URL` environment variable.

---

## 6. 🎥 Recording the demo video (7–10 min)

1. Project overview & App Router structure (30–60s).
2. Show all 3 roles in the live UI — how navigation/dashboards adapt per role.
3. CRUD via the UI — e.g. technician adds a service, admin edits a category, customer cancels a booking.
4. Trigger a form validation error and an API error (e.g. wrong password) to show toast/inline handling.
5. Full payment flow — **Pay now** → Stripe checkout → `/payment/success`.
6. Briefly explain one technical challenge (e.g. storing the JWT in a cookie so both client components and `middleware.ts` can read it for route protection, or the booking-status state machine driving the action buttons and progress stepper).

---

## 7. 📦 Submission

```
Frontend Repo    : https://github.com/Farhadmu/fixitnow-frontend
Live Frontend    : https://fixitnow-frontend-wki2.onrender.com/
Backend API      : https://fixitnow-2a0m.onrender.com
Demo Video       : <your Loom/Drive link>
Admin Email      : admin@fixitnow.com
Admin Password   : Admin123!
```

See [`API_INTEGRATION.md`](./API_INTEGRATION.md) for the full endpoint mapping (mandatory requirement #1).

### Commit history
Commits are split by feature (auth, browse/filter pages, booking flow, technician dashboard, admin dashboard, payment flow, analytics, etc.) to satisfy the 20-meaningful-commits requirement — see the repo's commit log.