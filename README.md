# The Lash Haus v2

This is a production-style Next.js starter for The Lash Haus.

## Included

- Public client website
- Booking page
- Gallery page
- Reviews page
- Contact page
- Admin dashboard UI
- Supabase-ready schema
- Stripe-ready environment setup

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin dashboard:

```text
http://localhost:3000/admin
```

## Deploy

1. Upload this project to GitHub.
2. Connect the GitHub repository to Vercel.
3. Create a Supabase project.
4. Run `supabase/schema.sql` inside Supabase SQL editor.
5. Add environment variables from `.env.example`.
6. Add Stripe keys when ready.
7. Deploy.

## Important

The admin dashboard is currently a UI starter. To make login, database writes, payments and email notifications fully live, connect the Supabase Auth/database functions and Stripe checkout/webhooks.
