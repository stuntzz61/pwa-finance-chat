import { Router } from 'express';
import { db } from '../db/memory';
import { v4 as uuid } from 'uuid';
const r = Router();

r.get('/operations', (_req,res)=> res.json(db.operations));

r.post('/operations', (req,res)=>{
  const now = new Date().toISOString();
  const op = { id: uuid(), audit: [], paid:0, ...req.body, createdAt: now, updatedAt: now };
  op.audit.push({ id: uuid(), at: now, by:'server', action:'create', payload:{title: op.title, total:op.total} });
  db.operations.push(op);
  res.json(op);
});

r.patch('/operations/:id', (req,res)=>{
  const op = db.operations.find(o=>o.id===req.params.id);
  if(!op) return res.sendStatus(404);
  Object.assign(op, req.body);
  op.updatedAt = new Date().toISOString();
  op.audit.push({ id: uuid(), at: op.updatedAt, by:'server', action:'update', payload:req.body });
  res.json(op);
});

r.delete('/operations/:id', (req,res)=>{
  const i = db.operations.findIndex(o=>o.id===req.params.id);
  if(i<0) return res.sendStatus(404);
  const op = db.operations[i];
  op.audit.push({ id: uuid(), at: new Date().toISOString(), by:'server', action:'delete' });
  db.operations.splice(i,1);
  res.sendStatus(204);
});

export default r;
