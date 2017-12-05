import passport from 'passport'
import FacebookTokenStrategy from 'passport-facebook-token'
import User from './models/user'

module.exports = () => {
    passport.use(
      new FacebookTokenStrategy(
        {
          clientID: '',
          clientSecret: ''
        },
        (accessToken, refreshToken, profile, done) => {
          User.upsertFbUser(accessToken, refreshToken, profile, (err, user) => {
              return done(err, user)
          })
        }))
}