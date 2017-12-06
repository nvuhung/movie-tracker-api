import passport from 'passport'
import FacebookTokenStrategy from 'passport-facebook-token'
import User from './models/user'

module.exports = () => {
  passport.use(
    new FacebookTokenStrategy ({
        clientID: '489083681491452',
        clientSecret: '36c3696b62d66190593c951979c5d795',
      },
      (accessToken, refreshToken, profile, done) => {
        // User.upsertFbUser(req, accessToken, refreshToken, profile, done, (err, user) => {
        //   return done(err, user)
        // })
        User.findOne({ 'facebookProvider.id': profile.id }, (err, user) => {
          if (!user) {
            var newUser = new User({
                email: profile.emails[0].value,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken
                }
            })
  
            newUser.save((error, savedUser) => {
              done(error, {
                id: savedUser.id,
                email: savedUser.email,
              });
            })
          } else {
            done(err, {
              id: user.id,
              email: user.email,
            });
          }
      })
      }
    )
  )
};
