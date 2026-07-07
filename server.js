import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
const app=express();
app.use(cors({origin:process.env.ALLOWED_ORIGIN||'*'}));
app.use(express.json());
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
const PORT=process.env.PORT||3001;
app.listen(PORT);
