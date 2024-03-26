const { db } = require("../config/database/db");
const { generateId } = require("../utils");


//get all users

const getAllUsers = async (req,res) => {
    const sqlQuery = 'SELECT * FROM users';

    let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }

    try {
        const result = await  client.query(sqlQuery);
        res.json(result.rows);
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }finally {
        client.release();
    }

}


//update a user 

const updateUser = async (req,res) => {
    const {id} = req.params;
    const {username, email, password} = req.body;
    const sqlQuery = `UPDATE users
                      SET
                        username=COALESCE($1, username),
                        email=COALESCE($2, email),
                        password=COALESCE($3, password)
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
        const result = await  client.query(sqlQuery,[username, email, password,id]);
        if(result.rowCount > 0) res.json("User successfully updated");
    } catch (error) {
        console.error('An error occured while attempting  query the database.',error.stack);
        res.stack(500).json('An error occured on the server please try again.')
    }finally {
        client.release();
    }
}

//delete user
const deleteUser = async (req,res) => {
    const {id} = req.params;
    const sqlQuery = `DELETE FROM users WHERE id=$1`;

    let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.status(500).json('An error occured on the server please try again.')
    }

    try {
        const result = await  client.query(sqlQuery,[id]);
        if(result.rowCount > 0){
            res.sendStatus(204)
        } else {
            res.status(404).json('The user was not found to delete.')
        }
    } catch (error) {
        console.error('An error occured while attempting to query the database.',error.stack);
        res.status(500).json('An error occured on the server please try again.')
    }finally {
        client.release();
    }
}

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser
}