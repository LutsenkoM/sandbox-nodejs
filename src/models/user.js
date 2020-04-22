const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error("Password cannot contain string 'password'");
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne( { email } );

  if (!user) {
    throw new Error('User not found.');
  }

  const isMatch = await bcryptjs.compare( password, user.password );

  if (!isMatch) {
    throw new Error('Wrong password!');
  }

  return user;
};

userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jsonwebtoken.sign( {_id: user._id.toString()}, 'sandboxsecretkey', { expiresIn: '7 days' });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcryptjs.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
