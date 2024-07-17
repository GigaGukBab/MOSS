import { printFigletAsync } from './figletPrint.mjs';
import mongoose from 'mongoose';
import { createApp } from './createApp.mjs';

mongoose
  .connect('mongodb://localhost/gigagukbab')
  .then(() => console.log('Connected to Database'))
  .catch((error) => console.error(error));

const app = createApp();

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
