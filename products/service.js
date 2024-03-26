const { db } = require("../config/database/db");
const { generateId } = require("../utils");


//retrieve all products
const getAllProducts = async (req,res) => {
    const sqlQuery = 'SELECT * FROM products';
    const client = await db.connect();

    try {
        const result = await db.query(sqlQuery);

        res.json(result.rows)

      
    } catch (error) {
        console.log(error);
        res.status(500).json('An error occured on the server')
     }finally {
        client.release();
     }
}

// add a new product
const createNewProduct = async(req,res) => {
    const newProductId = generateId();
    const {name, price, quantity} = req.body;

    const sqlQuery = "INSERT INTO products(id, name, price, quantity) VALUES($1,$2,$3,$4)";

     let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }

    try {
        const result = await  client.query(sqlQuery,[newProductId, name,price,quantity]);
        if(result.rowCount > 0) res.json("New product successfully added");
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }finally {
        client.release();
    }
}

//update product
const updateProduct = async (req,res) => {
    const {id} = req.params;
    const {name, price, quantity} = req.body;
    const sqlQuery = `UPDATE products
                      SET
                        name=COALESCE($1, name),
                        price=COALESCE($2, price),
                        quantity=COALESCE($3, quantity)
                     WHERE id=$4
                      `;

    let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }

    try {
        const result = await  client.query(sqlQuery,[name, price, quantity,id]);
        if(result.rowCount > 0) res.json("Product successfully updated");
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }finally {
        client.release();
    }

}

//delete product
const deleteProduct = async (req,res) => {
    const {id} = req.params;
    const sqlQuery = `DELETE FROM products WHERE id=$1`;

    let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }

    try {
        const result = await  client.query(sqlQuery,[id]);
        if(result.rowCount > 0){
            res.sendStatus(204)
        } else {
            res.status(404).json('The product was not found to delete.')
        }
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }finally {
        client.release();
    }

}

module.exports = {
    getAllProducts,
    createNewProduct,
    updateProduct,
    deleteProduct
}