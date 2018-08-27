const {
  mongoose
} = require("../db/mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})
const _ = require('lodash');
const bcrypt = require('bcryptjs');

UserSchema.methods.toJSON = function() {
  let user = this;
  let userObj = user.toObject();
  return _.pick(user, ['_id', 'email']);
}
UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({
    _id: user._id.toHexString(),
    access
  }, '123abc').toString();
  user.tokens.push({
    access,
    token
  });
  return user.save().then(() => {
    return token;
  });
}

UserSchema.statics.findByToken = function(token) {
  let User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, '123abc');
  } catch (e) {
    return Promise.reject();
  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

UserSchema.pre('save', function(next) {
  let user = this;
  console.log(user.password);
  console.log(user.isModified('password'));
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        console.log('password:' + hash);
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
