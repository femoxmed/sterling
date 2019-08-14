const mongoose = require("mongoose");
const config = require("config");

module.exports = app => {
  let DB_HOST = "";
  DB_HOST = config.get("DB_HOST");
  if (app.get("env") === "development") {
    DB_HOST = config.get("DB_HOST");
  } else if (app.get("env") !== "test" || app.get("env") !== "development") {
    app.set("env", "production");
    DB_HOST = config.get("DB_HOST");
  }

  mongoose
    .connect(DB_HOST, { useNewUrlParser: true })
    .then(() => {
      console.log(`Connected to ${DB_HOST} database successfully `);
    })
    .catch(e => {
      // if any error throw the error
      throw new Error(e.message);
    });
};
