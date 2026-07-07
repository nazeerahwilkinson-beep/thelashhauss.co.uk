import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));
app.use(express.json());

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@thelashhaus.co.uk';
const DATA_FILE = './admin-auth.json';

function initialPasswordHash() {
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'nazeerahelvos';
  return bcrypt.hashSync(password, 10);
}

function loadAuth() {
  if (!fs.existsSync(DATA_FILE)) {
    const data = { passwordHash: initialPasswordHash(), resetTokens: {} };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveAuth(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

async function send(subject, data) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: 'thelashhauss@gmail.com',
    subject,
    html: `<pre>${JSON.stringify(data, null, 2)}</pre>`
  });
}

async function sendHtml(subject, html) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: 'thelashhauss@gmail.com',
    subject,
    html
  });
}

app.get('/', (_, res) => res.json({ status: 'The Lash Haus Backend Running' }));

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  if (email !== ADMIN_EMAIL) return res.json({ success: false });
  const auth = loadAuth();
  const ok = await bcrypt.compare(password, auth.passwordHash);
  res.json({ success: ok });
});

app.post('/api/admin/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (email === ADMIN_EMAIL) {
    const auth = loadAuth();
    const token = crypto.randomBytes(32).toString('hex');
    auth.resetTokens[token] = Date.now() + 30 * 60 * 1000;
    saveAuth(auth);

    const adminUrl = process.env.ADMIN_URL || 'https://thelashhaus.co.uk/admin-site/admin.html';
    const resetLink = `${adminUrl}?resetToken=${token}`;

    await sendHtml(
      'The Lash Haus Admin Password Reset',
      `<h2>Password reset request</h2><p>Click the link below to reset your admin password. This link expires in 30 minutes.</p><p><a href="${resetLink}">${resetLink}</a></p>`
    );
  }
  res.json({ success: true });
});

app.post('/api/admin/reset-password', async (req, res) => {
  const { token, password } = req.body;
  const auth = loadAuth();
  const expires = auth.resetTokens[token];

  if (!expires || Date.now() > expires) {
    return res.json({ success: false });
  }

  auth.passwordHash = await bcrypt.hash(password, 10);
  delete auth.resetTokens[token];
  saveAuth(auth);

  res.json({ success: true });
});

app.post('/api/contact', async (req, res) => {
  await send('New Website Enquiry', req.body);
  res.json({ success: true });
});

app.post('/api/booking', async (req, res) => {
  await send('New Booking', req.body);
  res.json({ success: true });
});

app.post('/api/review', async (req, res) => {
  await send('New Review', req.body);
  res.json({ success: true });
});

app.post('/api/payment-link', async (req, res) => {
  if (!stripe) return res.status(400).json({ success: false, message: 'Stripe is not configured' });

  const amountPounds = Number(req.body.amount || process.env.DEFAULT_DEPOSIT_AMOUNT || 20);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: { name: 'The Lash Haus Booking Payment' },
        unit_amount: Math.round(amountPounds * 100)
      },
      quantity: 1
    }],
    success_url: `${process.env.CLIENT_URL}/?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/?payment=cancelled`
  });

  res.json({ success: true, url: session.url });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
