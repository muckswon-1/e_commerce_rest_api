// get all cart items

const { json } = require("express");
const { db } = require("../config/database/db");
const { getAllTableItems, insertIntoTable, deleteFromTable } = require("../config/database/service");
const { generateId, createNewItemFeedback, selectAllItemsFeeback, deleteItemFeedback } = require("../utils");

const getAllCartItems = async (req,res) => {
    const queryResult = await  getAllTableItems('cart');
    selectAllItemsFeeback(req,res,queryResult);
}

// create a new cart item
// if an item  exisits already , increment the count 
const createNewCartItem = async (req,res) => {
    const cartItem = req.body;
     let client;
     try {
         client = await db.connect();
         const exisitingItem = await client.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',[cartItem.user_id, cartItem.product_id]);
         if(exisitingItem.rows.length === 0){
            cartItem.id = generateId();
            const queryResult = await insertIntoTable('cart',cartItem);
            createNewItemFeedback(req,res,queryResult);
         } else {
           await client.query('UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',[cartItem.quantity, cartItem.user_id, cartItem.product_id])

           res.json('Cart count successfully updated');
           
         }
         
     } catch (error) {
        console.error(error);
        res.status(400).json('An error occured while querying the database')
     }finally {
        client.release();
     }

}


//delete item from cart if item count is 0
//decrement item count by 1 if item count is greator than 0
const deleteFromCart =  async (req,res) => {
    const {user_id, product_id} = req.params;
    
    let client;
    try {
        client = await db.connect();
        const exisitingItem =  await client.query('SELECT * FROM cart WHERE user_id=$1 AND product_id=$2',[user_id, product_id]);
        if( exisitingItem.rows.length === 0) {
            res.status(204).json('No such item in cart')
        }

        if(exisitingItem.rows[0].quantity === 1){
           await client.query('DELETE FROM cart WHERE user_id=$1 AND product_id=$2',[user_id,product_id]);
           res.status(204).json('Item removed from cart')
        } else {
            await client.query('UPDATE cart SET quantity = quantity - 1 WHERE user_id=$1 AND product_id=$2',[user_id,product_id]);
            res.json('Item quantity reduced by 1')
        }
    } catch (error) {
        console.error();
        res.status(400).json('An error occured while querying the database')
    }finally {
        client.release();
    }
}  


module.exports  = {
    getAllCartItems,
    createNewCartItem,
    deleteFromCart
}