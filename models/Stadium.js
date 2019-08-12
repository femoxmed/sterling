const mongoose = require("mongoose");
const Joi = require("joi");

const stadiumSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true
  }
});

function validateStadium(stadium) {
  const schema = {
    name: Joi.string()
      .required()
      .min(2)
      .max(50)
  };
  return Joi.validate(stadium, schema);
}
const Stadium = mongoose.model("Stadium", stadiumSchema);

module.exports = { Stadium, validateStadium };
