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
import routes from './routes/index.js';

const app = express();

// JSON 본문을 파싱하는 미들웨어
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 3100;

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

app.get('/', (request, response) => {
  response.status(201).send({ main_msg: "Hello to GigaGukBab's server" });
});
