import passport from 'passport';
import { Strategy as Auth0Strategy } from 'passport-auth0';
import { Auth0User } from '../mongoose/schemas/auth0-users.mjs';
import path from 'path';
import { config } from 'dotenv';

// NODE_ENV에 따라 환경 파일 경로 설정
const env = process.env.NODE_ENV || 'development';
let envFile = '';

if (env === 'development') {
  envFile = '.env.dev';
} else if (env === 'production') {
  envFile = '.env.prod';
}

// 환경 변수 파일 로드
config({ path: path.resolve(process.cwd(), envFile) });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await Auth0User.findById(id);
    if (!findUser) throw new Error('User not found');
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
    scope: 'openid profile email',
  },
  async (accessToken, refreshToken, extraParams, profile, done) => {
    let findUser;
    try {
      findUser = await Auth0User.findOne({ auth0Id: profile.id });
    } catch (error) {
      return done(error, null);
    }

    try {
      if (!findUser) {
        const newUser = new Auth0User({
          username: profile.displayName,
          auth0Id: profile.id,
        });
        const newSavedUser = await newUser.save();
        return done(null, newSavedUser);
      }
      return done(null, findUser);
    } catch (error) {
      console.log(error);
      return done(error, null);
    }
  }
);

passport.use(strategy);

export default passport;
