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
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'nazeerah.wilkinson@gmail.com';
const SEND_TO_EMAIL = process.env.SEND_TO_EMAIL || 'nazeerah.wilkinson@gmail.com';
const DATA_FILE = './admin-auth.json';

function mask(value) {
  if (!value) return 'MISSING';
  if (value.length <= 6) return 'SET';
  return `${value.slice(0, 3)}***${value.slice(-3)}`;
}

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

console.log('The Lash Haus backend starting...');
console.log('Allowed origin:', allowedOrigin);
console.log('Admin email:', ADMIN_EMAIL);
console.log('Send-to email:', SEND_TO_EMAIL);
console.log('SMTP host:', process.env.SMTP_HOST || 'MISSING');
console.log('SMTP port:', process.env.SMTP_PORT || 'MISSING');
console.log('SMTP user:', process.env.SMTP_USER || 'MISSING');
console.log('SMTP pass:', mask(process.env.SMTP_PASS));
console.log('From email:', process.env.FROM_EMAIL || 'MISSING');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function send(subject, data) {
  console.log('Sending email:', subject);

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: SEND_TO_EMAIL,
      subject,
      html: `<pre>${JSON.stringify(data, null, 2)}</pre>`
    });

    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('EMAIL_SEND_FAILED');
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    console.error('Error response:', error.response);
    console.error('Full error:', error);
    throw error;
  }
}

async function sendHtml(subject, html) {
  console.log('Sending HTML email:', subject);

  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: SEND_TO_EMAIL,
      subject,
      html
    });

    console.log('HTML email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('HTML_EMAIL_SEND_FAILED');
    console.error('Error code:', error.code);
    console.error('Error command:', error.command);
    console.error('Error response:', error.response);
    console.error('Full error:', error);
    throw error;
  }
}

app.get('/', (_req, res) => {
  res.json({
    status: 'The Lash Haus Backend Running',
    adminEmail: ADMIN_EMAIL,
    sendTo: SEND_TO_EMAIL,
    emailConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  });
});

app.get('/api/test-email', async (_req, res) => {
  try {
    await send('The Lash Haus test email', {
      message: 'This is a test email from your Render backend.',
      time: new Date().toISOString()
    });

    res.json({ success: true, message: 'Test email sent. Check Gmail inbox and spam.' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Email failed. Check Render logs.',
      code: error.code || null,
      response: error.response || null
    });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.json({ success: false });
  }

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
      `<h2>Password reset request</h2>
       <p>Click the link below to reset your admin password. This link expires in 30 minutes.</p>
       <p><a href="${resetLink}">${resetLink}</a></p>`
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
  try {
    await send('New Website Enquiry - The Lash Haus', req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Email failed', response: error.response || null });
  }
});

app.post('/api/booking', async (req, res) => {
  try {
    await send('New Booking - The Lash Haus', req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Email failed', response: error.response || null });
  }
});

app.post('/api/review', async (req, res) => {
  try {
    await send('New Review - The Lash Haus', req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Email failed', response: error.response || null });
  }
});

app.post('/api/payment-link', async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ success: false, message: 'Stripe is not configured' });
  }

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
app.listen(PORT, () => console.log(`The Lash Haus backend running on port ${PORT}`));
