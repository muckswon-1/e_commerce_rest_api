const productsRouter = require('express').Router();
const productsService = require('./service')


productsRouter.get('/products',productsService.getAllProducts);
productsRouter.post('/products/newProduct',productsService.createNewProduct);
productsRouter.put('/products/updateProduct/:id',productsService.updateProduct);
productsRouter.delete('/products/deleteProduct/:id',productsService.deleteProduct);


module.exports = productsRouter;