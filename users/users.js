const usersService = require("./service");

const usersRouter = require("express").Router();

usersRouter.get("/users", usersService.getAllUsers);
usersRouter.put("/users/:id", usersService.updateUser);
usersRouter.delete("/users/:id", usersService.deleteUser);

module.exports = usersRouter;
