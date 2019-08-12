const express = require("express");
const router = express.Router();

const { searchFixture, searchTeam } = require("../controllers/search");

router.get("/fixtures", searchFixture);
router.get("/teams", searchTeam);

module.exports = router;
