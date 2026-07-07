# The Lash Haus v3 Publish Ready

## Upload to GitHub

Upload these folders/files to your GitHub repository:
- client-site/
- admin-site/
- backend/

## Public links

Client site:
https://thelashhaus.co.uk/client-site/index.html

Admin site:
https://thelashhaus.co.uk/admin-site/admin.html

## Change admin password

Open:
admin-site/admin.js

Find:
ADMIN_PASSWORD='CHANGE_THIS_PASSWORD'

Replace with your own password.

## Render backend settings

Root Directory:
backend

Build Command:
npm install

Start Command:
npm start

## Render environment variables

Copy values from:
backend/.env.example

Add these extra Stripe values when ready:
STRIPE_SECRET_KEY
DEFAULT_DEPOSIT_AMOUNT
CLIENT_URL

## Publishing changes in GitHub

1. Open your GitHub repository.
2. Upload/replace changed files.
3. Commit changes.
4. Wait 1-2 minutes for GitHub Pages to update.

## Admin controls included

- Homepage layout: split, centered, full-image overlay
- Moving banner speed: slow, medium, fast
- Moving banner text
- Booking time slots
- Cancellation policy wording
- Cancellation window
- Payment method
- Deposit amount
- Review approval/hide
- Booking status
- Contact messages

Important: static admin settings use browser local storage. For secure shared live control across devices, connect a database/auth system.
