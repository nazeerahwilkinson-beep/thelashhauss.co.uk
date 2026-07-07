# The Lash Haus - GitHub Ready Project

## Folders

- `client-site/` public customer website
- `admin-site/` private admin dashboard
- `backend/` Node.js backend for Render

## Upload to GitHub

Upload everything in this ZIP to your repository.

## Links after GitHub Pages

Client:
`https://thelashhaus.co.uk/client-site/index.html`

Admin:
`https://thelashhaus.co.uk/admin-site/admin.html`

## Admin login

Open:
`admin-site/admin.js`

Find:
`const ADMIN_PASSWORD='CHANGE_THIS_PASSWORD';`

Replace `CHANGE_THIS_PASSWORD` with your own password before publishing.

Username:
`admin@thelashhaus.co.uk`

## Render backend

Root Directory:
`backend`

Build Command:
`npm install`

Start Command:
`npm start`

Environment variables:
Copy from `backend/.env.example`

## Stripe

Add your Stripe secret key in Render:
`STRIPE_SECRET_KEY`

The website payment button calls:
`/api/payment-link`

## Important

The static admin dashboard uses browser localStorage. It works for a front-end prototype, but a truly secure multi-device admin system requires database authentication such as Supabase Auth.
