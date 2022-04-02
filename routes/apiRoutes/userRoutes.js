import express from 'express'
// import createDummies from '../utils/buildData.js'

const userRoutes = express.Router()
import {
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
} from '../../controllers/userController.js'
import { protect, isAdmin } from '../../middleware/authMiddleware.js'

// userRoutes.get('/createdummies', createDummies)

// all urls start: /api/users
userRoutes.post('/register', registerUser)
userRoutes.post('/login', loginUser)
userRoutes.post('/logout', logoutUser)
userRoutes.get('/logout', logoutUser)
userRoutes
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

userRoutes.route('/').get(protect, isAdmin, getAllUsers)
userRoutes
  .route('/:id')
  .post(protect, isAdmin, createUser)
  .get(protect, isAdmin, getUser)
  .put(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser)

export default userRoutes
