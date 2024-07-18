import { printFigletAsync } from './figletPrint.mjs';
import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

mongoose
  .connect('mongodb://localhost/gigagukbab')
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

app.listen(port, async () => {
  console.log(`Running on port ${port}`);

  try {
    const figletTextAsync = await printFigletAsync('Welcome GigaGukBab!!');
    console.log(figletTextAsync);
  } catch (error) {
    console.error('Failed to print figlet:', error);
  }
});

app.use(express.static(path.join(__dirname, '../../moss-front/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../moss-front/build/index.html'));
});
console.log('Static files path:', path.join(__dirname, '../moss-front/build'));
console.log(
  'Index.html path:',
  path.join(__dirname, '../moss-front/build/index.html')
);

// 모든 요청에 대해 index.html 제공
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../moss-front/build/index.html'));
});
