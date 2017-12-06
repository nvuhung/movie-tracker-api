import {Router} from 'express'
import controller from './controller'
import passport from 'passport';
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt';

var passportConfig = require('./passport');

//setup configuration for facebook login
passportConfig();

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

const createToken = auth => {
  return jwt.sign(
    {
      id: auth.id
    }, 'my-secret',
    {
      expiresIn: 60 * 120
    }
  );
};

const generateToken = (req, res, next) => {
  req.token = createToken(req.auth);
  next();
};

const sendToken = (req, res) => {
  res.setHeader('x-auth-token', req.token);
  res.status(200).send(req.auth);
};

routes.post('/auth/facebook', passport.authenticate('facebook-token', {session: false}), (req, res, next) => {
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
      id: req.user.id
    };

    next();
  }, generateToken, sendToken);

  //token handling middleware
const authenticate = expressJwt({
  secret: 'my-secret',
  requestProperty: 'auth',
  getToken: function(req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

const getCurrentUser = (req, res, next) => {
  User.findById(req.auth.id, (err, user) => {
    if (err) {
      next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

const getOne = (req, res) => {
  var user = req.user.toObject();

  delete user['facebookProvider'];
  delete user['__v'];

  res.json(user);
};

routes.route('/auth/me')
  .get(authenticate, getCurrentUser, getOne);

export default routes;
