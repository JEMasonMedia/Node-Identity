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
// api logout
userRoutes.post('/logout', logoutUser)
// easy page logout
userRoutes.get('/logout', logoutUser)
// user profile management
userRoutes
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

// any administrator level control
// to eventually control many top level configurations ie. custom fields, domain access and others
// security level configuration will be command line only
userRoutes.route('/').get(protect, isAdmin, getAllUsers)
userRoutes
  .route('/:id')
  .post(protect, isAdmin, createUser)
  .get(protect, isAdmin, getUser)
  .put(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser)

export default userRoutes
