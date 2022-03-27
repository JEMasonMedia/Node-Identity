// const passport = require('.')

// const ensureAuth = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next()
//   } else {
//     res.status(401).json({ msg: 'Not Authorized' })
//   }
// }

// export default ensureAuth

// Authenticate: passport.authenticate('local'), (req, res) => {
//   console.log('logged in', req.user)
//   var userInfo = {
//     username: req.user.username,
//   }
//   res.send(userInfo)
// }

// module.exports = {
//   ensureAuth: (req, res, next) => {
//     if (req.isAuthenticated()) {
//       return next()
//     } else {
//       res.status(401).json({ msg: 'Not Authorized' })
//     }
//   },
//   // Authenticate: passport.authenticate('local'), (req, res) => {
//   //   console.log('logged in', req.user)
//   //   var userInfo = {
//   //     username: req.user.username,
//   //   }
//   //   res.send(userInfo)
//   // }
// }
