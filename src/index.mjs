import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';
import path from 'path';
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

const port = process.env.PORT || 3100;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

app.get('/', (req, res) => {
  console.log('Hello from moss!!!');
  return res.send('Hello from moss!!!');
});
