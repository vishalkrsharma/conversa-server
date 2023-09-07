import express from 'express';
import { chats } from './data/data.js';
import colors from 'colors';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
connectDB();

app.get('/', (req, res) => res.send('API Running Successfully'));

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => console.log(`SERVER PORT ${process.env.PORT || 5000}`.yellow.bold));
