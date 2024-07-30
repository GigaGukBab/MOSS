import Router from 'express';
import passport from 'passport';

const router = Router();

router.get(`/api/auth/status`, (request, response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post('/api/auth/logout', (request, response) => {
  request.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return response.sendStatus(500);
    }
    request.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return response.sendStatus(500);
      }
      response.clearCookie('connect.sid'); // 세션 쿠키 제거
      return response.sendStatus(200);
    });
  });
});

router.get('/api/auth/auth0', passport.authenticate('auth0'));

router.get('/api/auth/auth0/redirect', (req, res, next) => {
  console.log('Received callback with query:', req.query);
  passport.authenticate('auth0', (err, user, info) => {
    if (err) {
      console.error('Auth0 authentication error:', err);
      return res
        .status(500)
        .json({ error: 'Authentication failed', details: err.message });
    }
    if (!user) {
      console.log('User not authenticated. Info:', info);
      return res.status(401).json({ error: 'Unauthorized', details: info });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login error:', loginErr);
        return res.status(500).json({ error: 'Login failed' });
      }
      console.log('User authenticated:', req.user);
      console.log('Session:', req.session);
      res.redirect(`${process.env.CLIENT_URL}`);
    });
  })(req, res, next);
});

export default router;
