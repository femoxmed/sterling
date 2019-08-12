const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const user = require("../routes/user");
const admin = require("../routes/admin");
const search = require("../routes/search");
// const search = require("../routes/search");

// var redis = require("redis");
// var session = require("express-session");
// var redisStore = require("connect-redis")(session);
// var client = redis.createClient();
// const app = express();
// app.use(
//   session({
//     secret: "session_key",
//     // create new redis store.
//     store: new redisStore({
//       host: "localhost",
//       port: 6379,
//       client: client,
//       ttl: 260
//     }),
//     saveUninitialized: false,
//     resave: false
//   })
// );

module.exports = app => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use("/api", user);
  app.use("/api", admin);
  app.use("/api/search", search);
};
