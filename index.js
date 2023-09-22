import express from 'express';
import { chats } from './data/data.js';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
  })
);
app.use(express.json());
connectDB();

app.get('/', (req, res) => res.send('API Running Successfully'));

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(process.env.PORT || 5000, () => console.log(`SERVER PORT ${process.env.PORT || 5000}`.yellow.bold));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('Connected to Socket.io');
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join-chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  socket.on('new-message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message-received', newMessageReceived);
    });
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop-typing', (room) => socket.in(room).emit('stop-typing'));

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
