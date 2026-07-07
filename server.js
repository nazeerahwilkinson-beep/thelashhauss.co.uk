import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';

dotenv.config();
const app=express();
app.use(cors({origin:process.env.ALLOWED_ORIGIN||'*'}));
app.use(express.json());

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const transporter=nodemailer.createTransport({
 host:process.env.SMTP_HOST,
 port:Number(process.env.SMTP_PORT),
 secure:process.env.SMTP_SECURE==='true',
 auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}
});

async function send(subject,data){
 await transporter.sendMail({
  from:process.env.FROM_EMAIL,
  to:'thelashhauss@gmail.com',
  subject,
  html:`<pre>${JSON.stringify(data,null,2)}</pre>`
 });
}

app.get('/',(_,res)=>res.json({status:'The Lash Haus Backend Running'}));
app.post('/api/contact',async(req,res)=>{await send('New Website Enquiry',req.body);res.json({success:true});});
app.post('/api/booking',async(req,res)=>{await send('New Booking',req.body);res.json({success:true});});
app.post('/api/review',async(req,res)=>{await send('New Review',req.body);res.json({success:true});});
app.post('/api/payment',async(req,res)=>{await send('Payment Notification',req.body);res.json({success:true});});

app.post('/api/payment-link', async (req,res)=>{
 if(!stripe) return res.status(400).json({success:false,message:'Stripe is not configured'});
 const amountPounds = Number(req.body.amount || process.env.DEFAULT_DEPOSIT_AMOUNT || 20);
 const session = await stripe.checkout.sessions.create({
  mode:'payment',
  payment_method_types:['card'],
  line_items:[{
   price_data:{
    currency:'gbp',
    product_data:{name:'The Lash Haus Booking Payment'},
    unit_amount:Math.round(amountPounds*100)
   },
   quantity:1
  }],
  success_url:`${process.env.CLIENT_URL || process.env.ALLOWED_ORIGIN}/?payment=success`,
  cancel_url:`${process.env.CLIENT_URL || process.env.ALLOWED_ORIGIN}/?payment=cancelled`
 });
 res.json({success:true,url:session.url});
});

const PORT=process.env.PORT||3001;
app.listen(PORT,()=>console.log(`Running on ${PORT}`));
