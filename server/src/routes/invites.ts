import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db/memory';
const r = Router();

r.post('/create', (req,res)=>{
  const { projectId, phone } = req.body;
  if(!/^\+7\d{10}$/.test(phone)) return res.status(400).json({error:'bad phone'});
  const code = (Math.floor(100000 + Math.random()*900000)).toString();
  const invId = uuid();
  db.invites.set(invId, { id: invId, projectId, phone, code, createdAt: Date.now(), status:'pending' });
  res.json({ inviteId: invId, code, message:'Передайте код пользователю — он введёт его в приложении.' });
});

r.post('/accept', (req,res)=>{
  const { code, userId } = req.body;
  const invite = [...db.invites.values()].find(i=>i.code===code && i.status==='pending');
  if(!invite) return res.status(400).json({error:'invalid code'});
  const proj = db.projects.get(invite.projectId);
  if(!proj) return res.sendStatus(404);
  if(!proj.memberIds.includes(userId)) proj.memberIds.push(userId);
  const chat = [...db.chats.values()].find(c=>c.projectId===proj.id);
  if(chat && !chat.memberIds.includes(userId)) chat.memberIds.push(userId);
  invite.status = 'accepted';
  res.json({ ok:true, projectId: proj.id, chatId: chat?.id });
});

export default r;
