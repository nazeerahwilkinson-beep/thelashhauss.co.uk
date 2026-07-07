import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json());

const TO_EMAIL = "thelashhauss@gmail.com";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendMail(subject, html) {
  await transporter.sendMail({
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: TO_EMAIL,
    subject,
    html
  });
}

function rows(obj) {
  return Object.entries(obj)
    .map(([key, value]) => `<p><strong>${key}:</strong> ${String(value).replace(/[<>&]/g, "")}</p>`)
    .join("");
}

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "The Lash Haus backend" });
});

app.post("/api/booking", async (req, res) => {
  await sendMail("New booking request - The Lash Haus", `<h2>New booking request</h2>${rows(req.body)}`);
  res.json({ ok: true });
});

app.post("/api/contact", async (req, res) => {
  await sendMail("New website enquiry - The Lash Haus", `<h2>New website enquiry</h2>${rows(req.body)}`);
  res.json({ ok: true });
});

app.post("/api/review", async (req, res) => {
  await sendMail("New review submitted - The Lash Haus", `<h2>New review submitted</h2>${rows(req.body)}`);
  res.json({ ok: true });
});

app.post("/api/payment", async (req, res) => {
  await sendMail("Payment notification - The Lash Haus", `<h2>Payment notification</h2>${rows(req.body)}`);
  res.json({ ok: true });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`The Lash Haus backend running on port ${port}`));
