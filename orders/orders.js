const ordersRouter = require('express').Router();
const ordersService = require('./service');

ordersRouter.get('/',ordersService.getAllOrders);
ordersRouter.post('/',ordersService.createNewOrder);
ordersRouter.put('/:id',ordersService.updateOrder);
ordersRouter.delete('/:id',ordersService.deleteOrder);


module.exports = {ordersRouter};