import passport from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../mongoose/schemas/user.mjs';
import { comparePassword } from '../utils/helpers.mjs';

passport.serializeUser((user, done) => {
  console.log(`Inside Serialze User Callback.`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Inside Deserialize User Callback`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error('User not found');
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error('User not found');
      if (!comparePassword(password, findUser.password))
        throw new Error('Invalid Credentials');
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
