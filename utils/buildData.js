import axios from 'axios'
import adminSeed from './adminSeed.js'

const createDummies = (req, res, next) => {
  let fakeUsers = []
  let sendUser = {}

  try {
    axios.get('https://randomuser.me/api/?results=10').then((response) => {
      fakeUsers = response.data.results

      sendUser = adminSeed

      axios
        .post('http://localhost:3001/api/users/register', sendUser)
        .then(function (response) {
          // console.log(response)
        })
        .catch(function (error) {
          // console.log(error)
        })

      fakeUsers.forEach(async (user) => {
        sendUser = {
          firstName: user.name.first,
          lastName: user.name.last,
          userName: user.login.username,
          email: user.email,
          password: '123456',
          roles: 'user',
        }

        await axios
          .post('http://localhost:3001/api/users/register', sendUser)
          .then(function (response) {
            // console.log(response)
          })
          .catch(function (error) {
            // console.log(error)
          })
      })
    })
    return res.status(201).json({
      success: true,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    })
  }
}

export default createDummies
