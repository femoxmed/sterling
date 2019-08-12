const mongoose = require("mongoose");
const _ = require("lodash");
const { Team, validateTeam } = require("../models/Team");

//this function adds a team
const addTeam = async (req, res) => {
  // validate the request body
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const teamExist = await Team.findOne({ name: req.body.name });
  if (teamExist)
    return res
      .status(400)
      .send({ error: `team with name ${req.body.name} already exist!!!` });
  // pick team data from request body
  const newTeam = _.pick(req.body, ["name"]);

  // Create a new team
  const team = await new Team(newTeam);

  //store in mongodb
  await team.save();

  res.send({ success: "Team Registered" });
};

// this function gets the current team selected
const currentTeam = async (req, res) => {
  const team = await Team.findById(req.params.id).select(
    "-password -isAdmin -__v"
  );

  if (!team) {
    res.status(404).send({ error: "Team does not exist" });
  }
  res.send({ team });
};

// this function gets the current team selected
const allTeam = async (req, res) => {
  const team = await Team.find().select("-password -isAdmin -__v");
  res.send(team);
};

// update the team
const editTeam = async (req, res) => {
  // validate req.params.id
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({ error: "Invalid Team" });

  const team = await Team.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  });

  if (!team)
    return res
      .status(400)
      .send({ error: "invalid request, team does not exist" });

  res.send({ success: "team updated successfully" });
};

//deletes user from the database
const deleteTeam = async (req, res) => {
  const deleteTeam = await Team.findByIdAndRemove(req.params.id);

  if (!deleteTeam)
    return res.status(400).send({ error: "INVALID REQUEST, TEAM NOT FOUND" });

  res.send({ success: "team deleted" });
};

module.exports = {
  addTeam,
  allTeam,
  currentTeam,
  editTeam,
  deleteTeam
};
