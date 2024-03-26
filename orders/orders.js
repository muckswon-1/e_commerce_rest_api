const ordersRouter = require('express').Router();
const ordersService = require('./service');

ordersRouter.get('/orders',ordersService.getAllOrders);
ordersRouter.post('/orders/newOrder',ordersService.createNewOrder);
ordersRouter.put('/orders/updateOrder/:id',ordersService.updateOrder);
ordersRouter.delete('/orders/deleteOrder/:id',ordersService.deleteOrder);


module.exports = {ordersRouter};