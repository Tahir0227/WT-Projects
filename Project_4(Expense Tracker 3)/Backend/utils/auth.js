const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

function authUser(req, res, next) {
  const path = req.url;

  if (path === "/login") {
    next();
  } else {
    const token = req.headers.token;

    if (!token) {
      res.send({
        status: "error",
        message: "No token provided",
      });
    } else {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.headers.userid = payload.userId;
        next();
      } catch (e) {
        res.send({
          status: "error",
          message: "Invalid token",
        });
      }
    }
  }
}

module.exports = { authUser };
