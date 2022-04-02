import asyncHandler from 'express-async-handler'
import User from '../database/models/User.js'

// protect and isAdmin for API
const protect = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) return next()
  else {
    res.status(401).json({ msg: 'Not Authorized' })
  }
})

const isAdmin = asyncHandler(async (req, res, next) => {
  const user = await User.findById(String(req.user._id)).select('+isAdmin')

  if (user !== null && user.isAdmin) {
    next()
  } else {
    res.status(401).json({ msg: 'Not authorized as an admin' })
  }
})
////////////////////////////////////////////////////////////////////////////

// protectPage and isAdminPage for pages
const protectPage = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) return next()
  else {
    res.status(401).redirect('/login')
  }
})

const isAdminPage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(String(req.user._id)).select('+isAdmin')

  if (user !== null && user.isAdmin) {
    next()
  } else {
    res.status(401).redirect('/login')
  }
})

export { protect, isAdmin, protectPage, isAdminPage }
