import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import routes from './routes/index.mjs';
import express from 'express';
import mongoose from 'mongoose';
import './stretegies/auth0-stretegy.mjs';
import cors from 'cors';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(express.json()); // JSON 본문을 파싱하는 미들웨어
  app.use(cookieParser('helloWorld'));
  app.use(
    session({
      secret: 'your_secret_key',
      saveUninitialized: false,
      resave: false,
      cookie: { maxAge: 60000 * 60 },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(routes);

  return app;
}
