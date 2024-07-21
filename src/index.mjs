import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';
let envFile = '';

if (env === 'development') {
  envFile = '.env.dev';
} else if (env === 'production') {
  envFile = '.env.prod';
}

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const mongoDBep = process.env.MONGODB_ENDPOINT || '';

if (!mongoDBep) {
  console.error('MONGODB_ENDPOINT is not defined');
}

mongoose
  .connect(mongoDBep)
  .then(() => {
    if (mongoDBep.includes('localhost')) {
      console.log('Connected to MongoDB on development');
    } else if (mongoDBep.includes('mongodb+srv')) {
      console.log('Connected to MongoDB on production');
    }
  })
  .catch((error) => console.error(error));

const app = createApp();
export default async (req, res) => {
  await app(req, res);
};
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3100;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

// app.use(express.static(path.join(__dirname, '../../moss-front/build')));

app.get('/', (req, res) => {
  console.log('Hello from moss!!!');
  // res.sendFile(path.join(__dirname, '../moss-front/build/index.html'));
});

// // 모든 요청에 대해 index.html 제공
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../moss-front/build/index.html'));
// });
