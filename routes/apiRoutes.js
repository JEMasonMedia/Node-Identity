import express from 'express'
import userRoutes from './apiRoutes/userRoutes.js'

const apiRoutes = express.Router()

apiRoutes.use('/users', userRoutes)

export default apiRoutes
