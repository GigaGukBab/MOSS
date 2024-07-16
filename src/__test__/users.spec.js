import { createUserHandler, getUserByIdHandler } from '../handlers/users.mjs';
import * as validator from 'express-validator';
import * as helpers from '../utils/helpers.mjs';
import { User } from '../mongoose/schemas/user.mjs';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: 'Invalid field' }]),
  })),
  matchedData: jest.fn(() => ({
    username: 'test',
    password: 'test123',
    displayName: 'Test',
  })),
}));

jest.mock('../utils/helpers.mjs', () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock('../mongoose/schemas/user.mjs');

const mockRequest = {
  findUserIndex: 1,
};
const mockResponse = {
  sendStatus: jest.fn(),
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
};

describe('get users', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  it('should get user by id', () => {
    getUserByIdHandler(mockRequest, mockResponse);
    expect(mockResponse.send).toHaveBeenCalled();
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 2,
      username: 'jack',
      displayName: 'Jack',
      password: 'hello124',
    });
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it('should return 404 if user is not found', () => {
    mockRequest.findUserIndex = 10;
    getUserByIdHandler(mockRequest, mockResponse);
    expect(mockResponse.sendStatus).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(404);
    expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).not.toHaveBeenCalled();
  });
});

describe('create user', () => {
  const mockRequest = {};
  it('should status of 400 when there are errors', async () => {
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalled();
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith([{ msg: 'Invalid field' }]);
  });

  it('should status of 201 when user is created', async () => {
    jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest
      .spyOn(User.prototype, 'save')
      .mockResolvedValueOnce({
        id: 1,
        username: 'test',
        password: 'hashed_test123',
        displayName: 'Test',
      });

    await createUserHandler(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith('test123');
    expect(helpers.hashPassword).toHaveReturnedWith('hashed_test123');
    expect(User).toHaveBeenCalledWith({
      username: 'test',
      password: 'hashed_test123',
      displayName: 'Test',
    });

    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 1,
      username: 'test',
      password: 'hashed_test123',
      displayName: 'Test',
    });
  });

  it('send status of 400 when database fails to save user', async () => {
    jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));
    const savedMethod = jest
      .spyOn(User.prototype, 'save')
      .mockImplementationOnce(() => Promise.reject('failed to save user'));
    await createUserHandler(mockRequest, mockResponse);

    expect(savedMethod).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
