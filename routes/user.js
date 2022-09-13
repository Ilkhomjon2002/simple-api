const express = require("express");
const pool = require("../helpers/database");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/:id", async (req, res) => {
  try {
    const sqlQuery = "SELECT id,email,password,created_at FROM user WHERE id=?";
    const rows = await pool.query(sqlQuery, req.params.id);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
  res.status(200).json({ id: req.params.id });
});

router.post("/register", async function (req, res) {
  try {
    const { email, password } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const sqlQuery = "INSERT INTO user (email,password) VALUES (?,?)";
    const result = await pool.query(sqlQuery, [email, encryptedPassword]);
    const stringifiedData = JSON.parse(JSON.stringify(result.toString()));
    res.status(200).send("Added");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async function (req, res) {
  try {
    const { id, password } = req.body;
    const sqlGetUser = "SELECT * FROM user where id=?";
    const rows = await pool.query(sqlGetUser, id);
    if (rows) {
      const isValid = await bcrypt.compare(password, rows[0].password);
      res.status(200).json({ valid_password: isValid });
    } else res.status(200).send(`User with id ${id} wasn't found`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/update", async function (req, res) {
  try {
    const { email, id, password, new_pass } = req.body;
    const sqlGetUser = "SELECT * FROM user where id=?";
    const rows = await pool.query(sqlGetUser, id);
    if (rows) {
      const isValid = await bcrypt.compare(password, rows[0].password);
      if (isValid) {
        const sqlUpdateUser = `UPDATE LOW_PRIORITY user
            SET email='${email}', password='${new_pass}'
            WHERE id=${id}
            `;
        const row = await pool.query(sqlUpdateUser);
        if (row) {
          res.status(200).send("UPDATED");
        }
      } else {
        res.status(200).send("Password didn`t match");
      }
    } else res.status(200).send(`User with id ${id} wasn't found`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.delete("/delete", async function (req, res) {
  try {
    const { id, email, password } = req.body;
    const sqlSelectUser = `SELECT * FROM user where id=?`;
    const rows = await pool.query(sqlSelectUser, id);
    if (rows) {
      const isValid = await bcrypt.compare(password, rows[0].password);
      if (isValid) {
        const sqlDeleteUser = `DELETE  FROM user where id=${id}`;
        const row = await pool.query(sqlDeleteUser);
        row && res.status(200).send("Deleted");
      } else {
        res.status(200)._construct.send("Password didn`t match");
      }
    } else {
      res.status(200).send(`There is not user with this ${id} id`);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
