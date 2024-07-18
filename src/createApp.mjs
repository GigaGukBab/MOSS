import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import routes from './routes/index.mjs';
import express from 'express';
import mongoose from 'mongoose';
// import './stretegies/local-stretegy.mjs';
import './stretegies/auth0-stretegy.mjs';

export function createApp() {
  const app = express();

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

  app.get(`/api/auth/status`, (request, response) => {
    return request.user
      ? response.send(request.user)
      : response.sendStatus(401);
  });

  app.post('/api/auth/logout', (request, response) => {
    if (!request.user) return response.sendStatus(401);

    request.logout((err) => {
      if (err) return response.sendStatus(400);
      response.sendStatus(200);
    });
  });

  app.get('/api/auth/auth0', passport.authenticate('auth0'));

  app.get(
    '/api/auth/auth0/redirect',
    passport.authenticate('auth0'),
    (request, response) => {
      console.log(request.session);
      console.log(request.user);
      response.redirect('/');
    }
  );

  return app;
}
