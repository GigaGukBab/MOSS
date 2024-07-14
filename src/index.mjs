import express from 'express';
import routes from './routes/index.mjs';
import { printFigletAsync } from './figletPrint.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import './stretegies/local-stretegy.mjs';

const app = express();

mongoose
  .connect('mongodb://localhost/gigagukbab')
  .then(() => console.log('Connected to Database'))
  .catch((error) => console.error(error));

// JSON 본문을 파싱하는 미들웨어
app.use(express.json());
app.use(cookieParser('helloWorld'));
app.use(
  session({
    secret: 'your_secret_key',
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 * 60 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.post('/api/auth', passport.authenticate('local'), (request, response) => {
  response.sendStatus(200);
});

app.get(`/api/auth/status`, (request, response) => {
  console.log(`Inside /auth/status endpoint`);
  console.log(request.user);
  console.log(request.session);
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

app.post('/api/auth/logout', (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  });
});

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

// app.get('/', (request, response) => {
//   console.log(request.sessionID);
//   request.session.visited = true;
//   response.cookie('hello', 'world', { maxAge: 30000, signed: true });
//   response.status(201).send({ main_msg: "Hello to GigaGukBab's server" });
// });

// app.post('/api/auth', (request, response) => {
//   const {
//     body: { username, password },
//   } = request;
//   // TODO: add validation logic for username and password
//   const findUser = mockUsers.find((user) => user.username === username);
//   if (!findUser || findUser.password !== password)
//     return response.sendStatus(401).send({ message: 'BAD CREDENTIALS' });

//   request.session.user = findUser;
//   return response.status(200).send(findUser);
// });

// app.get('/api/auth/status', (request, response) => {
//   request.sessionStore.get(request.sessionID, (error, sessionData) => {
//     if (error) {
//       console.log(error);
//       throw error;
//     }
//     console.log(sessionData);
//   });
//   return request.session.user
//     ? response.status(200).send(request.session.user)
//     : response.sendStatus(401).send({ message: 'UNAUTHORIZED' });
// });
