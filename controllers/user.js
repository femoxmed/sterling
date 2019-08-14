const mongoose = require("mongoose");
const _ = require("lodash");
const { User, validate, loginValidate } = require("../models/User");

//register user
const registerUser = async (req, res) => {
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
  const user = await new User(newUser);

  //store in mongodb
  await user.save();

  //set user session in  redis

  //
  // console.log({ redis: a });

  res.send({ success: "User Registered" });
};

const loginUser = async (req, res) => {
  //validate the login credentials
  const { error } = loginValidate(req.body);
  // return error
  if (error) return res.status(400).send({ error: error.details[0].message });

  const loginCredentials = _.pick(req.body, ["email", "password"]);

  try {
    const user = await User.findByCredentials(loginCredentials);
    // check if the user's account has been verified
    if (!user) {
      return res.status(400).send({ error: "email or password is wrong" });
    }

    // generate an authentication token for the user
    // let a = client.hmset("x-auth-token", ["token", user.generateAuthToken()]);
    // //set redis
    // //
    req.session.xAuthToken = user.generateAuthToken();
    console.log(req.session.xAuthToken);
    res.send(_.pick(user, ["_id", "email", "isAdmin"]));
  } catch (error) {
    // console.log({ error: error.message });
    // res.sendStatus(500);
    res.status(404).send({ error: error.message });

    // log the error
  }
};

// this function gets the current user
const currentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -isAdmin -__v"
  );
  res.send({ user });
};

// this function gets the all user
const allUsers = async (req, res) => {
  const user = await User.find({ isAdmin: false }).select(
    "-password -isAdmin -__v"
  );
  res.send(user);
};

// this function gets the all user
const allAdminUsers = async (req, res) => {
  const user = await User.find({ isAdmin: true }).select("-password -__v");
  res.send(user);
};

const editUser = async (req, res) => {
  // const { error } = Validate(req.body);
  // if (error) return res.status(400).send({ error: error.details[0].message });

  // validate req.params.id
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({ error: "Invalid user" });

  const user = await User.findByIdAndUpdate(req.params.id, {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    deparment: req.body.deparment
  });

  if (!user)
    return res
      .status(400)
      .send({ error: "invalid request, user does not exist" });

  res.send({ success: "user updated successfully" });
};

//deletes user from the database
const deleteUser = async (req, res) => {
  const deleteUser = await User.findByIdAndRemove(req.params.id);

  if (!deleteUser)
    return res.status(400).send("INVALID REQUEST, USER NOT FOUND");

  res.send({ success: "user deleted" });
};

module.exports = {
  loginUser,
  registerUser,
  currentUser,
  allUsers,
  allAdminUsers,
  editUser,
  deleteUser
};
