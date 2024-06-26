const cartService = require("./service");

const cartRouter = require("express").Router();

cartRouter.get("/cart", cartService.getAllCartItems);
cartRouter.post("/cart", cartService.createNewCartItem);
cartRouter.delete("/cart/:user_id/:product_id", cartService.deleteFromCart);
cartRouter.delete("/cart/:id", cartService.deleteCartEntry);
cartRouter.get("/cart/user-cart/:user_id", cartService.getUserCartItemsById);

module.exports = cartRouter;
