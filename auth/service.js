const { db } = require("../config/database/db");
const { generateId, hashPassword } = require("../utils");



//create a new user 
const registerNewUser = async (req,res) => {
    const {username, email, password} = req.body;
    const secretPassword = await hashPassword(password);
    console.log(secretPassword);
    const id = generateId();
    const sqlQuery = 'INSERT INTO users(id,username,email,password) VALUES($1,$2,$3,$4)';
    let client;
    try {
         client = await db.connect();
    } catch (error) {
        console.error('An error occured while attempting to connect to the database.',error.stack);
        res.status(500).json('An error occured on the server please try again.')
    }

    try {
        const result = await  client.query(sqlQuery,[id,username,email,secretPassword]);
        if(result.rowCount > 0) res.json("Registration successful");
    } catch (error) {
        console.error('An error occured while attempting to query the database.',error.stack);
        res.status(500).json('An error occured on the server please try again.')
    }finally {
        client.release();
    }
}



module.exports = {
    registerNewUser,
   
}

