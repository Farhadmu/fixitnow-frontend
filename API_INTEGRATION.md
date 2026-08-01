# API Integration Map — FixItNow Frontend

This document maps every frontend route/component to the backend endpoint(s) it consumes.
Backend repo: https://github.com/Farhadmu/FixItNow
Backend base URL: set via `NEXT_PUBLIC_API_URL` (e.g. `https://fixitnow-2a0m.onrender.com/api`)

| Frontend Route | Component(s) | Backend Endpoint(s) | Notes |
|---|---|---|---|
| `/` | `app/(public)/page.tsx` | `GET /categories`, `GET /services` | Hero + featured services + category strip |
| `/services` | `app/(public)/services/page.tsx` | `GET /services`, `GET /categories` | Search/filter by category, location, price |
| `/technicians` | `app/(public)/technicians/page.tsx` | `GET /technicians` | Search/filter by name, location, rating |
| `/technicians/[id]` | `app/(public)/technicians/[id]/page.tsx`, `BookingForm.tsx` | `GET /technicians/:id`, `POST /bookings` | Profile, services, reviews, availability + booking form |
| `/login` | `app/(public)/login/page.tsx` | `POST /auth/login` | Stores JWT in cookie via `AuthProvider` |
| `/register` | `app/(public)/register/page.tsx` | `POST /auth/register` | Role selection (Customer/Technician) |
| `/payment/success` | `app/(public)/payment/success/page.tsx` | `POST /payments/confirm` | Reads `session_id` query param from Stripe redirect |
| `/payment/cancel` | `app/(public)/payment/cancel/page.tsx` | — | Static cancellation notice |
| `/dashboard/customer` | `app/dashboard/customer/page.tsx`, `CustomerBookingCard.tsx` | `GET /bookings`, `GET /payments`, `PATCH /bookings/:id/cancel` | Booking list + payment history |
| `/dashboard/customer/bookings/[id]/pay` | `app/dashboard/customer/bookings/[id]/pay/page.tsx` | `GET /bookings/:id`, `POST /payments/create` | Creates Stripe Checkout session, redirects to `checkoutUrl` |
| (inline on customer dashboard) | `ReviewForm.tsx` | `POST /reviews` | Shown when a booking is `COMPLETED` and has no review yet |
| `/dashboard/technician` | `app/dashboard/technician/page.tsx`, `TechnicianBookingRow.tsx` | `GET /technician/bookings/me` | Stats + pending requests |
| `/dashboard/technician/bookings` | `app/dashboard/technician/bookings/page.tsx` | `GET /technician/bookings/me`, `PATCH /technician/bookings/:id` | Filterable by status; Accept/Decline/Start/Complete actions |
| `/dashboard/technician/profile` | `app/dashboard/technician/profile/page.tsx`, `ProfileForm.tsx`, `AvailabilityScheduler.tsx`, `ServiceManager.tsx` | `GET /technicians/:id`, `PUT /technician/profile/me`, `PUT /technician/availability/me`, `POST /services`, `PATCH /services/:id`, `DELETE /services/:id`, `GET /categories` | Full self-management surface |
| `/dashboard/admin` | `app/dashboard/admin/page.tsx` | `GET /admin/users`, `PATCH /admin/users/:id`, `GET /admin/bookings` | User table + ban/unban + platform stats |
| `/dashboard/admin/categories` | `app/dashboard/admin/categories/page.tsx` | `GET /categories`, `POST /admin/categories` | Create + list categories |
| (all authenticated routes) | `useAuth.tsx` | `GET /auth/me` | Rehydrates the session on page load from the stored JWT |

## Auth & Route Protection

- JWT is stored in a cookie (`fixitnow_token`) plus the user's role (`fixitnow_role`) so it is readable both client-side and by `middleware.ts`.
- `src/middleware.ts` blocks unauthenticated or wrong-role access to `/dashboard/customer/**`, `/dashboard/technician/**`, and `/dashboard/admin/**`, redirecting to `/login` or the user's correct dashboard.
- `RequireRole.tsx` is a client-side defense-in-depth guard used inside each dashboard page (handles the loading state and redirects if the role check fails after hydration).

## Error Handling

- All API calls go through `src/lib/api.ts`, which throws a typed `ApiError` (status, message, errorDetails) matching the backend's `{ success, message, errorDetails }` shape.
- Mutations show `sonner` toast notifications on failure (`useBookings.ts`, `usePayments.ts`, `useTechnicianActions.ts`, `useAdmin.ts`).
- Form-level validation errors from the backend (Zod `errorDetails` array) are mapped back onto the relevant input via `ApiError.fieldErrors()` in the Login/Register forms.
- `app/error.tsx` and `app/not-found.tsx` provide graceful fallbacks for unexpected errors and 404s.

## Payment Flow

1. Customer clicks **Pay now** on an `ACCEPTED` booking → `/dashboard/customer/bookings/[id]/pay`.
2. Page calls `POST /payments/create` → backend returns a Stripe Checkout `checkoutUrl`.
3. Browser is redirected to Stripe's hosted checkout (test card `4242 4242 4242 4242`).
4. Stripe redirects back to `NEXT_PUBLIC_APP_URL/payment/success?session_id=...` or `/payment/cancel`.
5. The success page calls `POST /payments/confirm` with the `session_id` to finalize the payment and update the booking to `PAID`.

> ⚠️ For the redirect to land on this frontend, the backend's `CLIENT_URL` environment variable must be set to this app's deployed URL (e.g. `https://fixitnow-frontend.vercel.app`).
