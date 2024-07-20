import { printFigletAsync } from './figletPrint.mjs';
import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const isProduction = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);
const dbUri = isProduction
  ? process.env.MONGODB_ATLAS_URI
  : 'mongodb://localhost/gigagukbab';

mongoose
  .connect(dbUri)
  .then(() => console.log('Connected to Database'))
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

app.use(express.static(path.join(__dirname, '../../moss-front/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../moss-front/build/index.html'));
});

// 모든 요청에 대해 index.html 제공
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../moss-front/build/index.html'));
});
