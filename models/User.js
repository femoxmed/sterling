const mongoose = require("mongoose");
const Joi = require("joi");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    maxlength: 1050,
    trim: true
  }
});

userSchema.methods.generateAuthToken = function() {
  const user = this;
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
    },
    config.get("jwtPrivateKey")
  );
};

userSchema.statics.findByCredentials = async function(loginCredential) {
  const User = this;
  const { email, password } = loginCredential;
  //  find the user by the username or email address
  const user = await User.findOne({ email });

  if (user) {
    // tell bcrypt to compare their password
    const validated = await bcrypt.compare(password, user.password);

    if (validated) {
      // if password is valid
      return Promise.resolve(user);
    } else {
      const error = new Error("password is incorrect");
      return Promise.reject(error);
    }
  }
};

userSchema.pre("save", async function(next) {
  const user = this;

  // if the password is modified, encrypt it
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    next();
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

function validate(user) {
  schema = {
    firstName: Joi.string()
      .min(2)
      .max(50)
      .required(),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .max(50)
      .required(),
    phoneNumber: Joi.string().required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
      .strict(),
    confirm_password: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .strict()
  };
  return Joi.validate(user, schema);
}

function loginValidate(user) {
  const schema = {
    email: Joi.string()
      .required()
      .error(err => ({ message: "email address is required" })),
    password: Joi.string().required()
  };
  return Joi.validate(user, schema);
}

module.exports = { User, validate, loginValidate };
