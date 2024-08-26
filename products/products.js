const productsRouter = require("express").Router();
const productsService = require("./service");

productsRouter.get("/products", productsService.getAllProducts);
productsRouter.post("/products", productsService.createNewProduct);
productsRouter.put("/products/:id", productsService.updateProduct);
productsRouter.get("/products/:id",productsService.getProduct);
productsRouter.delete(
  "/products/deleteProduct/:id",
  productsService.deleteProduct,
);

module.exports = productsRouter;
