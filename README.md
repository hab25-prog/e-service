# E-Service

E-Service is a React + Vite frontend for browsing home services, booking technicians, and handling customer or technician sign-in flows.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and add your Supabase project values.

3. Start the app:

```bash
npm run dev
```

## Environment

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key
- `VITE_BACKEND_PROVIDER`: `local` or `supabase`

`local` keeps booking data in browser storage for development. `supabase` expects a `bookings` table and uses Supabase for booking persistence.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run preview`
