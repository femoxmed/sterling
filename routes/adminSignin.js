const { registerAdminUser } = require("../controllers/admin");

const adminAuth = require("../middleware/authorization");
const userAuth = require("../middleware/authentication");

router.post("/register-admin", [userAuth, adminAuth], registerAdminUser);
