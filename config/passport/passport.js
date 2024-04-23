const passport = require("passport");
const { db } = require("../database/db");
const { isValidPassword } = require("../../utils");
const LocalStrategy = require("passport-local").Strategy;

const validate = async (username, password, done) => {
  let client;
  const sqlQuery = "SELECT * FROM users WHERE username=$1";
  try {
    client = await db.connect();
  } catch (error) {
    console.error(
      "An error occured while attempting to connect to the database.",
      error.stack,
    );
    return done(error);
  }

  try {
    const result = await client.query(sqlQuery, [username]);
    if (result.rowCount > 0) {
      const user = result.rows[0];

      if (!isValidPassword(password, user.password)) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect username or password" });
    }
  } catch (error) {
    return done(error);
  } finally {
    client.release();
  }
};

passport.use(new LocalStrategy(validate));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  let client;
  const sqlQuery = "SELECT * FROM users WHERE id=$1";
  try {
    client = await db.connect();
  } catch (error) {
    return done(error);
  }

  try {
    const result = await client.query(sqlQuery);
    const user = result.rows[0];
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

module.exports = { passport };
