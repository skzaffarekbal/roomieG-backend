const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      minLength: [3, 'First name at least 3 character.'],
      maxLength: [50, 'First name at most 50 character.'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      minLength: [2, 'Last name at least 2 character.'],
      maxLength: [50, 'Last name at most 50 character.'],
      trim: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error('Invalid Email: ' + value);
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate(value) {
        if (!validator.isStrongPassword(value)) throw new Error('Please Provide Strong Password');
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    age: {
      type: Number,
      min: [18, 'Age should be min 18'],
      max: [100, "Age can't be above 100"],
    },
    gender: {
      type: String,
      validate(value) {
        if (!['male', 'female', 'others'].includes(value)) {
          throw new Error('Gender data is not valid');
        }
      },
    },
    photoUrl: {
      type: String,
      default: 'https://geographyandyou.com/images/user-profile.png',
      validate(value) {
        if (!validator.isURL(value)) throw new Error('Invalid URL: ' + value);
      },
    },
    about: {
      type: String,
      default: 'This is a default about of the user!',
      trim: true,
    },
    skills: {
      type: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin, isActive: user.isActive },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
