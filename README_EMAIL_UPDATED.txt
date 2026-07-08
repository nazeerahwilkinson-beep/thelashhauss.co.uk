# The Lash Haus Backend - Updated Email

Primary receiving email:
nazeerah.elvos@gmail.com

Admin email:
nazeerah.elvos@gmail.com

Render environment variables to add/update:

ALLOWED_ORIGIN=https://thelashhaus.co.uk
CLIENT_URL=https://thelashhaus.co.uk/client-site/index.html
ADMIN_URL=https://thelashhaus.co.uk/admin-site/admin.html

ADMIN_EMAIL=nazeerah.elvos@gmail.com
ADMIN_INITIAL_PASSWORD=nazeerahelvos

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=nazeerah.elvos@gmail.com
SMTP_PASS=<YOUR GOOGLE APP PASSWORD>
FROM_EMAIL=nazeerah.elvos@gmail.com
SEND_TO_EMAIL=nazeerah.elvos@gmail.com

After updating GitHub:
Render > Manual Deploy > Clear build cache & deploy

Test email:
https://thelashhauss-co-uk-2.onrender.com/api/test-email
