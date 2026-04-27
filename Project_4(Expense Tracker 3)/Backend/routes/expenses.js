const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

//display
router.get("/list", (req, res) => {
  const userId = req.headers.userid;
  const sql = "SELECT * FROM expenses WHERE user_id = ?";
  pool.query(sql, [userId], (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send({
        status: "success",
        message: "Expenses retrieved successfully",
        expenses: data,
      });
    }
  });
});

//add
router.post("/add", (req, res) => {
  const userId = req.headers.userid;
  const { name, amount, category, date } = req.body;
  const sql =
    "INSERT INTO expenses (user_id, name, amount, category, date) VALUES (?, ?, ?, ?, ?)";
  pool.query(sql, [userId, name, amount, category, date], (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send({
        status: "success",
        message: "Expense added successfully",
        expense: data,
      });
    }
  });
});

//update
router.put("/update/:id", (req, res) => {
  const userId = req.headers.userid;
  const expenseId = req.params.id;
  const { name, amount, category, date } = req.body;
  const sql =
    "UPDATE expenses SET name = ?, amount = ?, category = ?, date = ? WHERE expense_id = ? AND user_id = ?";
  pool.query(
    sql,
    [name, amount, category, date, expenseId, userId],
    (error, data) => {
      if (error) {
        res.send(error);
      } else if (data.affectedRows === 0) {
        res.send({
          status: "error",
          message: "Expense not found or not owned by user",
        });
      } else {
        res.send({
          status: "success",
          message: "Expense updated successfully",
          expense: data,
        });
      }
    },
  );
});

//delete
router.delete("/delete/:id", (req, res) => {
  const userId = req.headers.userid;
  const expenseId = req.params.id;
  const sql = "DELETE FROM expenses WHERE expense_id = ? AND user_id = ?";
  pool.query(sql, [expenseId, userId], (error, data) => {
    if (error) {
      res.send(error);
    } else if (data.affectedRows === 0) {
      res.send({
        status: "error",
        message: "Expense not found or not owned by user",
      });
    } else {
      res.send({
        status: "success",
        message: "Expense deleted successfully",
        expense: data,
      });
    }
  });
});

module.exports = router;
