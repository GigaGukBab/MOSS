import Router from 'express';
import passport from 'passport';

const router = Router();

router.get(`/api/auth/status`, (request, response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post('/api/auth/logout', (request, response) => {
  if (!request.user) return response.sendStatus(401);

  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  });
});

router.get('/api/auth/auth0', passport.authenticate('auth0'));

router.get(
  '/api/auth/auth0/redirect',
  passport.authenticate('auth0'),
  (request, response) => {
    console.log(request.session);
    console.log(request.user);
    response.redirect('/');
  }
);

export default router;
