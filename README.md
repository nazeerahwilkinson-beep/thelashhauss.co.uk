# The Lash Haus - Secure Admin Reset Build

## Added
- Backend-based admin login
- Initial admin password set to `nazeerahelvos`
- Forgot password flow
- Reset link sent to `thelashhauss@gmail.com`
- Password stored as a bcrypt hash in the backend file `admin-auth.json`

## Admin login
Email:
`admin@thelashhaus.co.uk`

Password:
`nazeerahelvos`

## Important Render settings

Root Directory:
`backend`

Build Command:
`npm install`

Start Command:
`npm start`

## Required Render environment variables
Copy from:
`backend/.env.example`

Most important:
- `ADMIN_EMAIL=admin@thelashhaus.co.uk`
- `ADMIN_INITIAL_PASSWORD=nazeerahelvos`
- `ADMIN_URL=https://thelashhaus.co.uk/admin-site/admin.html`
- `SMTP_PASS=your Gmail App Password`

## After uploading to GitHub
Upload/replace all files in this ZIP and commit changes.

Then in Render:
Manual Deploy > Clear build cache & deploy
