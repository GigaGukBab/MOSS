import mongoose from 'mongoose';

const Auth0UserSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  auth0Id: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
});

export const Auth0User = mongoose.model('Auth0User', Auth0UserSchema);
