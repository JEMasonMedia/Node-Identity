import asyncHandler from 'express-async-handler'
import User from '../database/models/User.js'
import passport from '../passport/index.js'

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    password2,
    fromForm,
  } = req.body

  if (password !== password2) {
    return res.status(400).json({ msg: 'Invalid user data' })
  }

  let userExists = await User.findOne({ $or: [{ email }, { userName }] })

  if (userExists !== null) {
    return res.status(400).json({ msg: 'User already exists' })
  }

  const user = await User.create({
    firstName,
    lastName,
    userName,
    email,
    password,
  })

  const createdUser = await User.findById(user._id)

  if (createdUser) {
    if (fromForm) res.status(201).redirect('/login')
    else res.status(201).json(createdUser)
  } else {
    return res.status(400).json({ msg: 'Invalid user data' })
  }
})

// @desc    Login user & set cookie
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
  // console.log(req.body)
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      res.clearCookie('connect.sid')
      req.session.destroy((err) => {
        res.status(400).json({ msg: 'Error Occurred' })
      })
      return next(err)
    }

    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' })
    delete user._doc.password

    req.logIn(user, (err) => {
      if (err) {
        res.clearCookie('connect.sid')
        req.session.destroy((err) => {
          res.status(400).json({ msg: 'Error Occurred' })
        })
        return next(err)
      }

      // console.log(req.body.rememberme)
      // console.log(req.session.cookie.maxAge)
      // if (req.body.rememberme)
      //   req.session.cookie.maxAge = 90 * 24 * 60 * 60 * 1000
      // console.log(req.session.cookie.maxAge)

      // if (fromForm) res.status(201).redirect('/profile')
      // else res.status(201).json(user)
      return req.body.fromForm
        ? res.status(201).redirect('/profile')
        : res.status(200).json({ user })
    })
  })(req, res, next)
})

// @desc    Logout user & destroy cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  if (req.user) {
    req.logOut()
    res.clearCookie('connect.sid')
    req.session.destroy((err) => {
      if (req.query.link) res.redirect('/login')
      else res.status(200).send({ msg: 'Logged Out' })
    })
  } else {
    res.status(304).send({ msg: 'None to Log Out' })
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// ******************************************************************************************************
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log('here')
  const { firstName, lastName, userName, email, password } = req.params
  console.log(req.body)
  let user = await User.findById(req.user._id)
  console.log(user)

  if (user) {
    user = {
      ...user,
      firstName,
      lastName,
      userName,
      email,
      password,
    }

    let updatedUser = await user.save()
    updatedUser = await User.findById(req.user._id)

    if (updatedUser) {
      res.json(updatedUser)
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  }
})
// ******************************************************************************************************

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Create a new user
// @route   POST /api/users/createuser
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body

  let userExists = await User.findOne({ $or: [{ email }, { userName }] })

  if (userExists !== null) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    firstName,
    lastName,
    userName,
    email,
    password,
  })

  if (user) {
    res.status(201).json(user)
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// ******************************************************************************************************
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body
  let user = await User.findById(req.params.id)

  if (user) {
    user._doc = {
      ...user._doc,
      firstName,
      lastName,
      userName,
      email,
      password,
    }

    let updatedUser = await user.save()
    updatedUser = await User.findById(req.params.id)

    if (updatedUser) {
      res.json(updatedUser)
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// ******************************************************************************************************

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
}
