import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { db } from '../db/memory';

const r = Router();

r.post('/project', (req,res)=>{
  const { title, creatorId } = req.body;
  const projId = uuid();
  const chatId = uuid();
  db.projects.set(projId, { id: projId, title, memberIds:[creatorId] });
  db.chats.set(chatId, { id: chatId, projectId: projId, title, memberIds:[creatorId] });
  res.json({ projectId: projId, chatId });
});

r.get('/my', (req,res)=>{
  const userId = String(req.query.userId||'me');
  const list = [...db.chats.values()].filter(c=>c.memberIds.includes(userId));
  res.json(list);
});

r.get('/:chatId/messages', (req,res)=>{
  const chatId = req.params.chatId;
  const msgs = [...db.messages.values()].filter(m=>m.chatId===chatId).sort((a,b)=>a.createdAt-b.createdAt);
  res.json(msgs);
});

r.post('/:chatId/messages', (req,res)=>{
  const { text, senderId, opId } = req.body;
  const msg = onNewMessage({ chatId: req.params.chatId, senderId, text, opId });
  res.json(msg);
});

export function onNewMessage({ chatId, senderId, text, opId }:{
  chatId:string; senderId:string; text:string; opId?:string;
}){
  const id = uuid();
  const createdAt = Date.now();
  const msg = { id, chatId, senderId, text, createdAt, opId };
  db.messages.set(id, msg);
  return msg;
}

export default r;
