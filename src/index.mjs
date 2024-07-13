import figlet from 'figlet';

figlet('Hello GigaGukBab!!', function (err, data) {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }
  console.log(data);
});

// =================================================================================================

import express from 'express';
import usersRouter from './routes/users.mjs';
import { mockUsers } from './utils/const.mjs';
import { resolveIndexByUesrById } from './utils/middlewares.mjs';

const app = express();

// JSON 본문을 파싱하는 미들웨어
app.use(express.json());
app.use(usersRouter);

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

// global middleware registration
// app.use(loggingMiddleware);

const port = process.env.PORT || 3100;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

app.get('/', (request, response) => {
  response.status(201).send({ main_msg: "Hello to GigaGukBab's server" });
});

app.get('/api/product', (request, response) => {
  response.send([{ id: 123, name: 'chicken breast', price: 12.99 }]);
});
