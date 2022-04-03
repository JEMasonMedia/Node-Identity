import express from 'express'
import User from '../database/models/User.js'
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

pageRoutes.route('/profile').get(protectPage, async (req, res) => {
  let navBarLinks = []

  let user = await User.findById(req.user._id).select('+isAdmin')

  if (user.isAdmin !== false)
    navBarLinks.push({
      linkText: 'Administration',
      linkIcon: '<i class="fa-solid fa-gears"></i>',
      linkTo: '/administration',
      active: false,
    })

  // console.log(user)
  // for some reason delete would not work to remove isAdmin, these instances of pulling a user twice will be resolved at some point
  // doesn't matter for server rendered pages, but for security, certain things are purposely omitted from going to the client
  user = await User.findById(user._id)
  // console.log(user)

  navBarLinks = [
    ...navBarLinks,
    {
      linkText: 'Profile',
      linkIcon: '<i class="fa-solid fa-user"></i>',
      linkTo: '/profile',
      active: true,
    },
    {
      linkText: 'FutureUse',
      linkIcon: '<i class="fa-solid fa-circle-nodes"></i>',
      linkTo: '#',
      active: false,
    },
    {
      linkText: 'Logout',
      linkIcon: '<i class="fa-solid fa-right-from-bracket"></i>',
      linkTo: '/api/users/logout?link=true',
      active: false,
    },
  ]

  res.render('Profile', {
    pTitle: 'Profile',
    navBarLinks,
    user,
  })
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
