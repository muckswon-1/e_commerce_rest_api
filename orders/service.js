const { db } = require("../config/database/db");
const {v4: generateOrderId} = require('uuid');


//get all orders
const getAllOrders =  async (req,res) => {
    const sqlStr = "SELECT * FROM orders";
   const client = await  db.connect();

   try {

    const result = await client.query(sqlStr);
    res.json({orders: result.rows});

   } catch (error) {
      console.log(error);
      res.status(500).json('An error occured on the server')
   }finally {
    client.release();
   }

}

//create a new order
const createNewOrder = async (req,res) => {
    const newOrderId = generateOrderId();
    const {name, state} = req.body;
   
    const sqlStr = "INSERT INTO orders(id, name, state) VALUES($1, $2, $3)";
    const client = await db.connect();
    try {
        const result = await client.query(sqlStr,[newOrderId,name,state]);
        if(result.rowCount > 0){
            res.status(201).json('Order created successfully.');
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json('An error occured on the server');
    }finally {
        client.release();
    }
 }

 //update order statud
 const updateOrder = async (req,res) => {
    const id = req.params.id;
    const {state} = req.body;

    const sqlStr = "UPDATE orders SET state=$1 WHERE id=$2";
    const client = await db.connect();

    try {
        const result = await client.query(sqlStr,[state,id]);
        if(result.rowCount > 0) {
            res.status(204).json('Order state updated successfully')
        }else {
            res.status(400).json('Order with that ID does not exist.');
        }
    } catch (error) {
        console.log(error);
        res.status(500).json('An error occured on the server')
    }finally{
        client.release();
    }
 }

 //delete an order
 const deleteOrder = async (req,res) => {
    const id = req.params.id;
    const sqlStr = "DELETE FROM orders WHERE id=$1";
    const client = await db.connect();

    try {
        const result = await client.query(sqlStr,[id]);
        if(result.rowCount > 0) {
            res.status(204).json('Order successfully deleted');
        }else {
            res.status(400).json('Order with that ID does not exist.');
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json('An error occured on the server')
    }finally {
        client.release();
    }

 }



module.exports = {
    getAllOrders,
    createNewOrder, 
    updateOrder,
    deleteOrder
}