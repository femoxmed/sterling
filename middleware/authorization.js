const authorize = (req, res, next) => {
  // this function authorizes the admin
  if (req.user.isAdmin) {
    // pass control to the next function
    next();
  } else {
    res.status(403).send({ error: 'Access Forbidden!!' });
  }
};

module.exports = authorize;
