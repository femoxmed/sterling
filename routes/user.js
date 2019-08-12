const express = require("express");

const {
  loginUser,
  registerUser,
  currentUser,
  allUsers,
  editUser,
  deleteUser
} = require("../controllers/user");
const authenticate = require("../middleware/authentication");
const authorize = require("../middleware/authorization");
const {
  pendingFixtures,
  completedFixtures,
  ongoingFixtures
} = require("../controllers/fixtures");
const router = express.Router();

//route to register
router.post("/register", registerUser);

//route to login
router.post("/login", loginUser);

// get the current user
router.get("/me", authenticate, currentUser);

// get the all user
router.get("/", authenticate, authorize, allUsers);

// route to edit user profile
router.put("/edit/:id", authenticate, editUser);

router.put("/delete/:id", authenticate, authorize, deleteUser);

router.get("/pending-fixtures", authenticate, pendingFixtures);
router.get("/completed-fixtures", authenticate, completedFixtures);
router.get("/ongoing-fixtures", authenticate, ongoingFixtures);

module.exports = router;
