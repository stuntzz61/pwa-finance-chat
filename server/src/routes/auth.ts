import { Router } from 'express';
import { db } from '../db/memory';
import crypto from 'crypto';
const r = Router();

r.post('/request', (req,res)=>{
  const { phone } = req.body;
  if(!/^\+7\d{10}$/.test(phone)) return res.status(400).json({error:'bad phone'});
  const code = (Math.floor(100000 + Math.random()*900000)).toString();
  db.authRequests[code] = { phone, code, createdAt: Date.now() };
  res.json({ code, message: 'Откройте @Fin_TBG_bot и отправьте этот код боту' });
});

r.post('/confirm', (req,res)=>{
  const { code, chatId } = req.body;
  const reqv = db.authRequests[code];
  if(!reqv) return res.status(400).json({error:'invalid code'});
  db.telegramLinks[chatId] = { phone: reqv.phone, linkedAt: Date.now() };
  const token = crypto.randomBytes(24).toString('hex');
  res.json({ token, phone: reqv.phone });
});

export default r;
