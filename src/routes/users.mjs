import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { getUserValidationSchema } from '../utils/validationSchema.mjs';
import { validationResult } from 'express-validator';
import { mockUsers } from '../utils/const.mjs';
import { createUserValidationSchema } from '../utils/validationSchema.mjs';
import { matchedData } from 'express-validator';
import { resolveIndexByUesrById } from '../utils/middlewares.mjs';

const usersRouter = Router();

usersRouter.get(
  '/api/users',
  checkSchema(getUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

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

usersRouter.post(
  '/api/users',
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);

    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    const data = matchedData(request);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  }
);

usersRouter.get(
  '/api/users/:id',
  resolveIndexByUesrById,
  (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
  }
);

usersRouter.put(
  '/api/users/:id',
  resolveIndexByUesrById,
  (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);
  }
);

usersRouter.patch(
  '/api/users/:id',
  resolveIndexByUesrById,
  (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return response.sendStatus(200);
  }
);

usersRouter.delete(
  '/api/users/:id',
  resolveIndexByUesrById,
  (request, response) => {
    const { findUserIndex } = request;
    mockUsers.splice(findUserIndex, 1);
    return response.sendStatus(200);
  }
);

export default usersRouter;
