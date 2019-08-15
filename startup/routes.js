const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const user = require("../routes/user");
const admin = require("../routes/admin");
const search = require("../routes/search");
// const search = require("../routes/search");

module.exports = app => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/api", user);
  app.use("/api", admin);
  app.use("/api/search", search);
};
