export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        'Username must be at least of 5 characters with a max of 32 characters',
    },
    notEmpty: {
      errorMessage: 'Username cannot be empty.',
    },
    isString: {
      errorMessage: 'Username must be a string.',
    },
  },
  displayName: {
    notEmpty: true,
  },
  password: {
    notEmpty: true,
  },
};

export const getUserValidationSchema = {
  filter: {
    in: ['query'],
    isString: {
      errorMessage: 'Must be a string',
    },
    notEmpty: {
      errorMessage: 'Must not be empty',
    },
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: 'Must be at least 3-10 characters',
    },
  },
  value: {
    in: ['query'],
    optional: true,
  },
};
