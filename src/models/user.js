import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
});

UserSchema.statics = {
    upsertFbUser:
      (accessToken, refreshToken, profile, cb) => this.findOne({ 'facebookProvider.id': profile.id }, (err, user) => {
          if (!user) {
            var newUser = new UserSchema({
                email: profile.emails[0].value,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken
                }
            })

            newUser.save((error, savedUser) => {
                return cb(error, savedUser);
            })
          } else {
              return cb(err, user)
          }
      })
};

export default mongoose.model('Movie', MovieSchema)