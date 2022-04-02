import express from 'express'
import { protectPage, isAdminPage } from '../middleware/authMiddleware.js'

const pageRoutes = express.Router()

pageRoutes.route('/register').get((req, res) => {
  res.render('Register', {
    pTitle: 'Register',
    navBarLinks: [
      {
        linkText: 'Register',
        linkIcon: '<i class="fa-solid fa-id-card"></i>',
        linkTo: '/register',
        active: true,
      },
      {
        linkText: 'Login',
        linkIcon: '<i class="fa-solid fa-right-to-bracket"></i>',
        linkTo: '/login',
        active: false,
      },
    ],
  })
})

pageRoutes.route('/login').get((req, res) => {
  res.render('Login', {
    pTitle: 'Login',
    navBarLinks: [
      {
        linkText: 'Register',
        linkIcon: '<i class="fa-solid fa-id-card"></i>',
        linkTo: '/register',
        active: false,
      },
      {
        linkText: 'Login',
        linkIcon: '<i class="fa-solid fa-right-to-bracket"></i>',
        linkTo: '/login',
        active: true,
      },
    ],
  })
})

pageRoutes.route('/profile').get(protectPage, (req, res) => {
  res.render('Profile')
})

pageRoutes
  .route('/administration')
  .get(protectPage, isAdminPage, (req, res) => {
    res.render('Administration')
  })

pageRoutes.route('/*').get((req, res) => {
  res.redirect('Login')
})

export default pageRoutes
