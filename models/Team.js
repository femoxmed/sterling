const mongoose = require("mongoose");
const Joi = require("joi");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true
  }
});

function validateTeam(team) {
  const schema = {
    name: Joi.string()
      .required()
      .min(2)
      .max(50)
  };
  return Joi.validate(team, schema);
}
const Team = mongoose.model("Team", teamSchema);

module.exports = { Team, validateTeam };
