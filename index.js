const express = require("express");
const app = express();
const PORT = 6000 || process.env.PORT;

// var redis = require("redis");
// var session = require("express-session");
// var redisStore = require("connect-redis")(session);
// var client = redis.createClient();

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

require("./startup/database")(app);
require("./startup/routes")(app);

console.log("Env:", app.get("env"));
console.log("Jwt Private", process.env.jwtPrivateKey);

const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

module.exports = server;
