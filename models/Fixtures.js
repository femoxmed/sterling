const mongoose = require("mongoose");
const Joi = require("joi");

const fixturesSchema = new mongoose.Schema({
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true
  },
  stadiumName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  uniqueIdLink: {
    type: String
  },

  fixtureStartDate: {
    type: Date,
    required: true
  },
  fixtureEndDate: {
    type: Date,
    required: true
  }
});

function validateFixtures(fixtures) {
  const schema = {
    teamA: Joi.objectId().required(),
    teamB: Joi.objectId().required(),
    stadiumName: Joi.objectId().required(),
    fixtureStartDate: Joi.date().required(),
    fixtureEndDate: Joi.date().required()
  };
  return Joi.validate(fixtures, schema);
}
const Fixtures = mongoose.model("Fixture", fixturesSchema);

module.exports = { Fixtures, validateFixtures };
