const express = require("express");
const router = express.Router();
const {
  registerAdminUser,
  getOneUser,
  allUsers
} = require("../controllers/admin");

const adminAuth = require("../middleware/authorization");
const userAuth = require("../middleware/authentication");

const {
  addTeam,
  allTeam,
  currentTeam,
  editTeam,
  deleteTeam
} = require("../controllers/team");

const {
  addFixtures,
  allFixtures,
  currentFixture,
  editFixtures,
  deleteFixtures,
  generateUniqueLink,
  currentFixtureWithLink
} = require("../controllers/fixtures");

const {
  addStadium,
  allStadium,
  currentStadium,
  editStadium,
  deleteStadium
} = require("../controllers/stadium");

// //route to get all users
router.post("/register-admin", [userAuth, adminAuth], registerAdminUser);
//route to get all users
router.get("/getallusers", [userAuth, adminAuth], allUsers);

//route to get a particular user
router.get("/user/:id", [userAuth, adminAuth], getOneUser);

//route to add team
router.post("/team", [userAuth, adminAuth], addTeam);

//route to fetch team
router.get("/team/:id", [userAuth, adminAuth], currentTeam);

router.get("/team", [userAuth, adminAuth], allTeam);
//route to update
router.put("/team/:id", [userAuth, adminAuth], editTeam);

//route to delete
router.patch("/team/:id", [userAuth, adminAuth], deleteTeam);

//this route updates the shipment status to whatever

// fixtures

router.post("/fixture", [userAuth, adminAuth], addFixtures);

//route to fetch team
router.get("/fixture/:id", [userAuth, adminAuth], currentFixture);

router.get("/fixture", [userAuth, adminAuth], allFixtures);
//route to update
router.put("/fixture/:id", [userAuth, adminAuth], editFixtures);

router.get(
  "/generate-fixture-link/:id",
  [userAuth, adminAuth],
  generateUniqueLink
);

//get match from link
router.get("/match/:uniqueIdLink", [userAuth], currentFixtureWithLink);

//route to delete

router.put("/delete-fixtures", [userAuth, adminAuth], deleteFixtures);

//stadium

//route to add team
router.post("/stadium", [userAuth, adminAuth], addStadium);

//route to fetch team
router.get("/stadium/:id", [userAuth, adminAuth], currentStadium);

router.get("/stadium", [userAuth, adminAuth], allStadium);
//route to update
router.put("/stadium/:id", [userAuth, adminAuth], editStadium);

//route to delete
router.patch("/stadium/:id", [userAuth, adminAuth], deleteStadium);

module.exports = router;
