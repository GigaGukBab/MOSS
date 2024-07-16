import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { getUserValidationSchema } from '../utils/validationSchema.mjs';
import { validationResult } from 'express-validator';
import { mockUsers } from '../utils/const.mjs';
import { createUserValidationSchema } from '../utils/validationSchema.mjs';
import { matchedData } from 'express-validator';
import { resolveIndexByUesrById } from '../utils/middlewares.mjs';
import { User } from '../mongoose/schemas/user.mjs';
import { hashPassword } from '../utils/helpers.mjs';
import { createUserHandler, getUserByIdHandler } from '../handlers/users.mjs';

const router = Router();

router.get(
  '/api/users',
  checkSchema(getUserValidationSchema),
  (request, response) => {
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (error, sessionData) => {
      if (error) {
        console.log(error);
        throw error;
      }
      console.log('Inside Session Store Get');
      console.log(sessionData);
    });
    const result = validationResult(request);
    // console.log(result);

    const {
      query: { filter, value },
    } = request;

    if (filter && value)
      return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
      );
    return response.send(mockUsers);
  }
);

router.post(
  '/api/users',
  checkSchema(createUserValidationSchema),
  createUserHandler
);

// router.post(
//   '/api/users',
//   checkSchema(createUserValidationSchema),
//   (request, response) => {
//     const result = validationResult(request);
//     console.log(result);

//     if (!result.isEmpty())
//       return response.status(400).send({ errors: result.array() });

//     const data = matchedData(request);
//     const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
//     mockUsers.push(newUser);
//     return response.status(201).send(newUser);
//   }
// );

router.get('/api/users/:id', resolveIndexByUesrById, getUserByIdHandler);

router.put('/api/users/:id', resolveIndexByUesrById, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch('/api/users/:id', resolveIndexByUesrById, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete('/api/users/:id', resolveIndexByUesrById, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
