const { db } = require("../config/database/db");
const { selectById } = require("../config/database/service");
const {
  generateId,
  hashPassword,
  genToken,
  selectByIdFeedback,
} = require("../utils");

//user login
const loginUser = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json("Incorrect username or password");
    }

    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    };
    const token = genToken(req.user);
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal server error");
  }
};

//create a new user
const registerNewUser = async (req, res) => {
  const { username, email, password } = req.body;
  const secretPassword = await hashPassword(password);
  console.log(secretPassword);
  const id = generateId();
  const sqlQuery =
    "INSERT INTO users(id,username,email,password) VALUES($1,$2,$3,$4)";
  let client;
  try {
    client = await db.connect();
  } catch (error) {
    console.error(
      "An error occured while attempting to connect to the database.",
      error.stack,
    );
    res.status(500).json("An error occured on the server please try again.");
  }

  try {
    const result = await client.query(sqlQuery, [
      id,
      username,
      email,
      secretPassword,
    ]);
    if (result.rowCount > 0) res.json(true);
  } catch (error) {
    console.error(
      "An error occured while attempting to query the database.",
      error.stack,
    );
    res.status(500).json("An error occured on the server please try again.");
  } finally {
    client.release();
  }
};

//user logout
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Error loggin out");
    }

    res.json(true);
  });
};

//get a users information
const getUserById = async (req, res) => {
  const { id } = req.params;
  const queryResult = await selectById("users", id, "id");
  selectByIdFeedback(req, res, queryResult);
};

module.exports = {
  registerNewUser,
  loginUser,
  logoutUser,
  getUserById,
};
