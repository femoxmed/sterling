// import the modelsconst
const mongoose = require("mongoose");
const moment = require("moment");
const _ = require("lodash");
let uuid = require("node-uuid");
const { Fixtures, validateFixtures } = require("../models/Fixtures");
const { Team } = require("../models/Team.js");
const { Stadium } = require("../models/Stadium.js");

const addFixtures = async (req, res) => {
  // validate the request body
  const { error } = validateFixtures(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const teamAId = req.body.teamA;
  const teamBId = req.body.teamB;
  const stadiumNameId = req.body.stadiumName;

  // to check if the ids are valid mongoose id
  if (!mongoose.Types.ObjectId.isValid(teamAId))
    return res.status(400).send({ error: "Invalid Home Team !!!" });

  if (!mongoose.Types.ObjectId.isValid(teamBId))
    return res.status(400).send({ error: "Invalid Away Team !!!" });

  if (!mongoose.Types.ObjectId.isValid(stadiumNameId))
    return res.status(400).send({ error: "Invalid Stadium Team !!!" });

  const teamA = await Team.findOne({ _id: teamAId });

  if (!teamA)
    return res.status(400).send({ error: "Home Team does not exist" });

  const teamB = await Team.findOne({ _id: teamBId });

  if (!teamB)
    return res.status(400).send({ error: "Away Team does not exist" });

  const stadiumName = await Stadium.findOne({ _id: stadiumNameId });

  if (!stadiumName)
    return res
      .status(400)
      .send({ error: "Stadium  does not exist Please Add to the database" });

  const newFixtures = _.pick(req.body, [
    "teamA",
    "teamB",
    "stadiumName",
    "fixtureStartDate",
    "fixtureEndDate"
  ]);

  //create a random url for the fixture
  let uniqueIdLink = uuid.v4();

  // Create a new user
  const fixture = await new Fixtures({ ...newFixtures, uniqueIdLink });

  //store in mongodb
  await fixture.save();

  //set user session in  redis
  //   client.hmset("users", user);
  //

  res.send({ success: "Match fixtures added successfully" });
};

// this function gets the current team selected
const currentFixture = async (req, res) => {
  const fixtures = await Fixtures.findById(req.params.id).select("-__v");

  if (!fixtures) {
    res.status(404).send({ error: "Fixture not found" });
  }
  res.send(fixtures);
};

// this function gets the current team selected
const currentFixtureWithLink = async (req, res) => {
  let uniqueIdLink = req.params.uniqueIdLink;

  const fixtures = await Fixtures.findOne({ uniqueIdLink }).select("-__v");

  if (!fixtures) {
    res.status(404).send({ error: "Fixture not found" });
  }
  res.send(fixtures);
};

const generateUniqueLink = async (req, res) => {
  //create a random url for the fixture
  // let uniqueIdLink = uuid.v4();
  //the id for the link should come from the request body
  const fixture = await Fixtures.findById(req.params.id);
  const link = "localhost:6000/api/match/" + fixture.uniqueIdLink;
  res.send({
    uniqueFixtureLink: link
  });
};
// this function gets the current team selected
const allFixtures = async (req, res) => {
  const fixtures = await Fixtures.find()
    .populate("teamA -__v")
    .select("-__v");
  // const fixtures = await Fixtures.find().select(" -__v");
  res.send(fixtures);
};

const pendingFixtures = async (req, res) => {
  let fixtures = await Fixtures.find().select(" -__v");
  let data = fixtures.filter(fixture => {
    return moment().isBefore(fixture.fixtureStartDate);
  });

  console.log(data);
  res.send(data);
};

const ongoingFixtures = async (req, res) => {
  let fixtures = await Fixtures.find().select(" -__v");
  let data = fixtures.filter(fixture => {
    return moment().isAfter(fixture.fixtureStartDate);
  });
  console.log(data);
  res.send(data);
};

const completedFixtures = async (req, res) => {
  const fixtures = await Fixtures.find().select(" -__v");
  let data = fixtures.filter(fixture => {
    return moment().isAfter(fixture.fixtureEndTime);
  });
  res.send(data);
};

// update the team
const editFixtures = async (req, res) => {
  // validate the request body
  // const { error } = validateFixtures(req.body);
  // if (error) return res.status(400).send({ error: error.details[0].message });

  // validate req.params.id
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send({ error: "Invalid Team" });
  const newFixtures = _.pick(req.body, [
    "teamA",
    "teamB",
    "stadiumName",
    "fixtureDate"
  ]);

  const fixture = await Fixtures.findByIdAndUpdate(req.params.id, {
    ...newFixtures
  });

  if (!fixture)
    return res
      .status(400)
      .send({ error: "invalid request, Fixture does not exist" });

  res.send({ success: "fixture updated successfully" });
};

//deletes user from the database
const deleteFixtures = async (req, res) => {
  const deleteFixtures = await Fixtures.findByIdAndRemove(req.params.id);

  if (!deleteFixtures)
    return res
      .status(400)
      .send({ error: "INVALID REQUEST, FIXTURE NOT FOUND" });

  res.send({ success: "fixture deleted" });
};

module.exports = {
  addFixtures,
  allFixtures,
  currentFixture,
  editFixtures,
  deleteFixtures,
  currentFixtureWithLink,
  generateUniqueLink,
  pendingFixtures,
  completedFixtures,
  ongoingFixtures
};
