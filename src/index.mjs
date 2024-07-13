import express from 'express';
import routes from './routes/index.mjs';
import { printFigletAsync } from './figletPrint.mjs';
import cookieParser from 'cookie-parser';

const app = express();

// JSON 본문을 파싱하는 미들웨어
app.use(express.json());
app.use(cookieParser('helloWorld'));
app.use(routes);

const port = process.env.PORT || 3100;

app.listen(port, async () => {
  console.log(`Running on port ${port}`);

  try {
    const figletTextAsync = await printFigletAsync('Hello GigaGukBab!!');
    console.log(figletTextAsync);
  } catch (error) {
    console.error('Failed to print figlet:', error);
  }
});

app.get('/', (request, response) => {
  response.cookie('hello', 'world', { maxAge: 30000, signed: true });
  response.status(201).send({ main_msg: "Hello to GigaGukBab's server" });
});
