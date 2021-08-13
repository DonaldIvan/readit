import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import trim from './middleware/trim';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import auth from './routes/auth';
import posts from './routes/posts';
import subs from './routes/subs';
import misc from './routes/misc';

dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  }),
);

app.get('/', (_, res) => res.send('Hello world'));
app.use('/api/auth', auth);
app.use('/api/posts', posts);
app.use('/api/subs', subs);
app.use('/api/misc', misc);

app.listen(port, async () => {
  console.log(`server running at http://localhost:${port}`);
  try {
    await createConnection();
  } catch (error) {
    console.log(error);
  }
});
