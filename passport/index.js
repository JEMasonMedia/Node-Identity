import passport from 'passport'
import LocalStrategy from './localStrategy.js'
import User from '../database/models/User.js'

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
  done(null, { _id: user._id })
})

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }, 'username', (err, user) => {
    done(null, user)
  })
})

//  Use Strategies
passport.use(LocalStrategy)

export default passport
