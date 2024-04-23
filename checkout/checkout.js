const checkoutRouter = require("express").Router();
const checkoutService = require("./service");

checkoutRouter.post("/cart/:user_id/checkout", checkoutService.checkout);

module.exports = checkoutRouter;
