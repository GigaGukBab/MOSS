import { mockUsers } from './const.mjs';

export const resolveIndexByUesrById = (request, response, next) => {
  const {
    params: { id },
  } = request;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return response.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};
