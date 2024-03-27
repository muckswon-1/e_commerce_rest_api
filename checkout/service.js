const { selectById, insertIntoTable, updateById, deleteFromTable } = require("../config/database/service");
const { calcuclateTotal, generateId, getObjectValue } = require("../utils");


const checkout =  async (req,res) => {
    const userId = req.params.user_id;
    const selectCartItemsUserId = await selectById('cart',userId,'user_id');
    const cartItems = selectCartItemsUserId.rows;
     let products = [];
     let quantities = [];
     for(const cartItem of [...cartItems]){
         const selectProductsById = await selectById('products',cartItem.product_id,'id');
          products.push(selectProductsById.rows[0]);
        
     }

    // console.log(products);
    // console.log(cartItems);
    console.log(quantities);

    //TODO: Add shiiping address and payment information
    //TODO: Validate product availability

    //calculate each item total amount 
    const cartItemsTotals = calcuclateTotal(cartItems,products);
    console.log('Totals',cartItemsTotals);

    //create an order and insert into the orders table 
    const orderId = generateId();
    const order = {
        id: orderId,
        user_id: userId,
        shipping_address: 'sipping address',
        payment_method: 'mpesa',
        payment_details: {"name":"Cyril Mukabwa"},
        state: 'pending'
    }

    const orderCreationSqlResult =  await insertIntoTable('orders',order);

    if(orderCreationSqlResult === 200){
        let deleteCartItemsResult;
        for(const cartItem of cartItems){
            const orderItem = {
                id: generateId(),
                order_id: orderId,
                quantity: cartItem.quantity,
                unit_price: getObjectValue(products,'unit_price',cartItem.product_id,'id')
            }

            const insertOrderItemResult =  await insertIntoTable('order_items',orderItem);
            if(insertOrderItemResult === 200){
                deleteCartItemsResult =  await deleteFromTable('cart',cartItem.id);
                
            }
        }

        if(deleteCartItemsResult === 204){
            res.json('You successfully placed an order.');
        }
    }
}

module.exports = {
    checkout
} 