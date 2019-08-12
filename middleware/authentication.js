const jwt = require("jsonwebtoken");
const config = require("config");

const authenticate = (req, res, next) => {
  //  read the request header for the stored token in the header
  const token = req.session.xAuthToken;
  console.log({ middleware: token });
  if (!token) {
    return res.status(401).send("Access denied. No token provided");
  }
  // try and verify payload
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded; // pass the decoded payload to the req as a user object.
    next();
  } catch (error) {
    res.status(400).send("Invalid token!");
  }
};

module.exports = authenticate;
