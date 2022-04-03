import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
    },
    userName: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Username is required'],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Email is required'],
    },
    password: {
      type: String,
      trim: true,
      required: [true, 'Password is required'],
      select: false,
    },
    roles: {
      type: String,
      default: 'user',
      required: true,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    select: false,
  }
)

// Define schema methods
userSchema.methods = {
  checkPassword: function (inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password)
  },
  hashPassword: (plainTextPassword) => {
    return bcrypt.hashSync(plainTextPassword, 10)
  },
}

// Define hooks for pre-saving
userSchema.pre('save', function (next) {
  if (!this.password) {
    next()
  } else {
    this.password = this.hashPassword(this.password)
    next()
  }
})

const User = mongoose.model('User', userSchema)

export default User
