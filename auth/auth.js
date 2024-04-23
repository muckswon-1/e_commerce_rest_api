const { passport } = require("../config/passport/passport");
const authService = require("./service");

const authRouter = require("express").Router();

// register user
authRouter.post("/users/register", authService.registerNewUser);
authRouter.post(
  "/users/login",
  passport.authenticate("local", { session: false }),
  authService.loginUser,
);
authRouter.get("/users/logout", authService.logoutUser);
authRouter.get("/users/:id", authService.getUserById);

module.exports = authRouter;
