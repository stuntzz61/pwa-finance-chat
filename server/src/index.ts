import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import auth from './routes/auth';
import finance from './routes/finance';
import invites from './routes/invites';
import chats, { onNewMessage } from './routes/chats';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', auth);
app.use('/finance', finance);
app.use('/invites', invites);
app.use('/chats', chats);
app.get('/health', (_req,res)=>res.json({ok:true}));

const server = http.createServer(app);
const io = new Server(server, { cors:{ origin:'*' } });

io.on('connection', (socket)=>{
  socket.on('auth', ({ userId })=>{
    socket.data.userId = userId;
  });
  socket.on('joinChat', ({ chatId })=>{
    socket.join(`chat:${chatId}`);
  });
  socket.on('message', ({ chatId, text, opId } )=>{
    const msg = onNewMessage({ chatId, senderId: socket.data.userId || 'me', text, opId });
    io.to(`chat:${chatId}`).emit('message', msg);
  });
});

const port = process.env.PORT || 8081;
server.listen(port, ()=>console.log('API+WS on :' + port));
