import mongoose from 'mongoose'
import User from '../database/models/User.js'

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      trim: true,
      required: [true, 'Role name is required'],
    },
    roleDescription: {
      type: String,
      trim: true,
      required: [true, 'Role description is required'],
    },
    roleHierarchy: {
      type: int,
      required: [true, 'Role hierarchy is required'],
    },
  },
  {
    timestamps: true,
  }
)

// Define schema methods
roleSchema.methods = {
  userHasRole: function (id, role) {
    const user = await User.findById(id)

    if (user.roles == 'ALL') return true
    return !user.roles.split(',').indexOf(role) == -1
  },
  userAddRole: function (id, role) {
    const user = await User.findById(id)

    if (this.userHasRole(id, role)) return user.roles
    else return user.roles.split(',').push(role).join(',')
  },
  userHierarchy: (id) => {
    const user = await User.findById(id)
    const roles = await this.find({})
    let highestH = 0

    user.roles.split(',').map(userRole => {
      roles.map(role => {
        if (role.roleName == userRole)
          if (role.roleHierarchy > highestH)
            highestH = role.roleHierarchy
      })
    })

    return highestH
  },
}

// Define hooks for pre-saving
// userSchema.pre('save', function (next) {
//   if (!this.password) {
//     next()
//   } else {
//     this.password = this.hashPassword(this.password)
//     next()
//   }
// })

const Role = mongoose.model('Role', roleSchema)

export default Role
