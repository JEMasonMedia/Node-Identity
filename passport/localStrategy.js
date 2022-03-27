import User from '../database/models/User.js'
import Strategy from 'passport-local'
const LocalStrategy = Strategy

const strategy = new LocalStrategy((username, password, done) => {
  const usernameORemail =
    username.indexOf('@') === -1 ? { userName: username } : { email: username }

  User.findOne(usernameORemail, (err, user) => {
    if (err) return done(err)

    if (!user)
      return done(null, false, {
        message: 'Username/Email or password is incorrect',
      })

    if (!user.checkPassword(password))
      return done(null, false, {
        message: 'Username/Email or password is incorrect',
      })

    return done(null, user)
  }).select('+password')
})

export default strategy
