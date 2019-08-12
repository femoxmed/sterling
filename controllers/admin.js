const { User, userSchema, validate } = require("../models/User");
const _ = require("lodash");

const mongoose = require("mongoose");

const registerAdminUser = async (req, res) => {
  // validate the request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const userExist = await User.findOne({ email: req.body.email });
  if (userExist)
    return res
      .status(400)
      .send({ error: `user with email ${req.body.email} already exist!!!` });
  // pick user data from request body
  const newUser = _.pick(req.body, [
    "email",
    "firstName",
    "lastName",
    "department",
    "phoneNumber",
    "password"
  ]);

  // Create a new user
  const user = await new User({ ...newUser, isAdmin: true });

  //store in mongodb
  await user.save();

  //set user session in  redis

  // let a = client.hmset("users", [JSON.stringify(user)]);
  //
  // console.log({ redis: a });

  res.send({ success: "Admin User Registered" });
};

const allUsers = async (req, res) => {
  const users = await User.find();
  if (users.length == 0) {
    res.send("No registered users available!");
  }
  res.send(users);
};

const getOneUser = async (req, res) => {
  const User = await User.findById(req.body._id);
  if (User) {
    res.send(User);
  }
  res.status(404).send({ error: "User does not Exist " });
};

module.exports = { registerAdminUser, allUsers, getOneUser };
