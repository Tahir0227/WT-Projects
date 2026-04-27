const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

//login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  pool.query(sql, [username, password], (error, data) => {
    if (error) {
      res.send(error);
    } else if (data.length === 0) {
      res.send({
        status: "error",
        message: "Invalid credentials",
        user: data[0],
      });
    } else {
      const payload = { userId: data[0].user_id };
      const token = jwt.sign(payload, JWT_SECRET);

      res.send({
        status: "success",
        message: "Login successful",
        token: token,
      });
    }
  });
});

module.exports = router;
