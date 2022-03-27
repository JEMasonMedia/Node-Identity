import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import passport from './passport/index.js'
import connectDB from './database/index.js'
import userRoutes from './routes/userRoutes.js'

// Load config
dotenv.config()

// Connect to DB
connectDB()

// Create app
const app = express()

app.enable('trust proxy')

app.use(function (req, res, next) {
  if (process.env.NODE_ENV != 'development' && !req.secure) {
    return res.redirect('https://' + req.headers.host + req.url)
  }

  next()
})

// Middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:3001/',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

//session configuration
const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: 'sessions',
  ttl: 60000,
})

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: mongoStore,
    cookie: { maxAge: 60000 },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
)

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Static folder
// app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.get('/', (req, res) => {
  res.json({ msg: 'this worked' })
})

app.use('/api/users', userRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 4000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
