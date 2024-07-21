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

router.get(
  '/api/auth/auth0/redirect',
  passport.authenticate('auth0'),
  (request, response) => {
    console.log(request.session);
    console.log(request.user);
    response.redirect(`${process.env.CLIENT_URL}`);
  }
);

export default router;
