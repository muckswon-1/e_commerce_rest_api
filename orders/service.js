const { db } = require("../config/database/db");
const { getAllTableItems, insertIntoTable, deleteFromTable, updateById } = require("../config/database/service");
const { generateId, selectAllItemsFeeback, createNewItemFeedback, deleteItemFeedback, updateItemFeedback } = require("../utils");



//get all orders
const getAllOrders =  async (req,res) => {
    const queryResult = await  getAllTableItems('orders');
    selectAllItemsFeeback(req,res,queryResult);

}

//create a new order
const createNewOrder = async (req,res) => {
    const newOrderId = generateId();
    const newOrder = req.body;
    newOrder.id = newOrderId;
    const queryResult = await insertIntoTable('orders');
    createNewItemFeedback(req,res,queryResult);
 }

 //update order status
 const updateOrder = async (req,res) => {
    const {id} = req.params;
    const orderUpdate = req.body;
    const queryResult = updateById('orders',orderUpdate,'id',id);
    updateItemFeedback(req,res,queryResult);

 }

 //delete an order
 const deleteOrder = async (req,res) => {
    const id = req.params.id;
    const queryResult = deleteFromTable('orders',id);
    deleteItemFeedback(req,res,queryResult)

 }



module.exports = {
    getAllOrders,
    createNewOrder, 
    updateOrder,
    deleteOrder
}