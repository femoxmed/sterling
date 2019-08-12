const mongoose = require("mongoose");

module.exports = app => {
  let DB_HOST = "";

  if (app.get("env") === "development") {
    DB_HOST = "mongodb://localhost:27017/sterling_app";
  } else {
    app.set("env", "production");
    DB_HOST = "mongodb://mongo:27017/sterling_app";
  }

  mongoose
    .connect(DB_HOST, { useNewUrlParser: true })
    .then(() => {
      console.log("Database connected successfully ");
    })
    .catch(e => {
      // if any error throw the error
      throw new Error(e.message);
    });
};
