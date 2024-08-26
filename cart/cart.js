const { verifyToken } = require("../utils");
const cartService = require("./service");

const cartRouter = require("express").Router();

cartRouter.get("/cart", cartService.getAllCartItems);
cartRouter.post("/cart", verifyToken, cartService.createNewCartItem);
cartRouter.delete("/cart",verifyToken, cartService.deleteFromCart);
//cartRouter.delete("/cart/:id",verifyToken,  cartService.deleteCartEntry);
cartRouter.delete("/cart/:user_id",verifyToken,cartService.deleteCart);
cartRouter.get("/cart/:user_id", verifyToken, cartService.getUserCartItemsById);

module.exports = cartRouter;
