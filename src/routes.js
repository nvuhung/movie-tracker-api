import {Router} from 'express'
import controller from './controller'
import passport from './passport';
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt';

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.render('index', {title: 'Express Babel'});
});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const {title} = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request or 422
    // Unprocessable Entity instead of the default 500 of the global error handler
    // (e.g check out https://github.com/kbariotis/throw.js). This is just for demo
    // purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', {title});
});

routes.get('/search', controller.search);

routes.post('/save', controller.save);

routes.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'user_location'],
    session: false,
  }),
);

routes.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, 'my-secret', { expiresIn });
    res.redirect('/');
  },
);

export default routes;
