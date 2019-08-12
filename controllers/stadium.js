const mongoose = require("mongoose");
const _ = require("lodash");
const { Stadium, validateStadium } = require("../models/Stadium");

//this function adds a team
const addStadium = async (req, res) => {
  // validate the request body
  const { error } = validateStadium(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const stadiumExist = await Stadium.findOne({ name: req.body.name });
  if (stadiumExist)
    return res
      .status(400)
      .send({ error: `Stadium with name : ${req.body.name} already exist!!!` });
  // pick Stadium data from request body
  const newStadium = _.pick(req.body, ["name"]);

  // Create a new user
  const stadium = await new Stadium(newStadium);

  //store in mongodb
  await stadium.save();

  res.send({ success: "Stadium Registered" });
};

// this function gets the current Stadium selected
const currentStadium = async (req, res) => {
  const stadium = await Stadium.findById(req.params.id).select("-__v");
  res.send(stadium);
};

// this function gets the current Stadium selected
const allStadium = async (req, res) => {
  const stadium = await Stadium.find().select("-__v");
  res.send(stadium);
};

// update the Stadium
const editStadium = async (req, res) => {
  // validate req.params.id
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({ error: "Invalid Stadium" });

  const stadium = await Stadium.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  });

  if (!stadium)
    return res
      .status(400)
      .send({ error: "invalid request, Stadium does not exist" });

  res.send({ success: "Stadium updated successfully" });
};

//deletes user from the database
const deleteStadium = async (req, res) => {
  const deleteStadium = await Stadium.findByIdAndRemove(req.params.id);

  if (!deleteStadium)
    return res
      .status(400)
      .send({ error: "INVALID REQUEST, Stadium NOT FOUND" });

  res.send({ success: "Stadium deleted" });
};

module.exports = {
  addStadium,
  allStadium,
  currentStadium,
  editStadium,
  deleteStadium
};
