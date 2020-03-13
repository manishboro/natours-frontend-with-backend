const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please tell is your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!']
  },
  photo: { type: String, default: 'default.jpg' },
  password: {
    type: String,
    required: [true, 'Please enter a password!'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      //this only works on CREATE and SAVE!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords do not match!'
    }
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  //encrypting the password only when it is actually modified
  if (!this.isModified('password')) return next();

  //hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //deleting the passwordconfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  //3) Update changedPasswordAt property for the user
  this.passwordChangedAt = Date.now() - 1000; //1000 is subtracted to nullify the latency between issuing a token and saving data in the database
  next();
});

//query middleware
userSchema.pre(/^find/, function(next) {
  //this points to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    // console.log(changeTimeStamp, JWTTimestamp);
    return JWTTimestamp < changeTimeStamp; //100 < 200 means true or password is changed after the token was issued
  }

  //false means that the password is not changed
  return false;
};

userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = await crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //it expires after ten minutes of creation
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
