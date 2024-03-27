const  {v4: uuid4} = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const SALTROUNDS = Number(process.env.SALTROUNDS);



// generate a uuid
const generateId = () => {
    const newId = uuid4();

    return newId;
}

//hash password
const hashPassword = async (password) => {
    const salt = bcrypt.genSaltSync(SALTROUNDS);
    const hash = bcrypt.hashSync(password,salt)
    return hash;
}

//compare password

const isValidPassword = async (password,secretPassword) => {
    return bcrypt.compareSync(password, secretPassword);
}


//geneate token
const genToken = (payload) => {
    const secret = process.env.JWT_SECRET
    return jwt.sign(payload,secret,{expiresIn: '1h'})
}

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json('Unauthorized')
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json('Invalid token')
    }
}

//fetch all items from the databse feedback
const selectAllItemsFeeback = (req,res ,queryResult) => {

    if(queryResult == 500){
        res.status(500).json('An error occured on the server, please try again')
    }

    if(queryResult === 400) {
        res.status(400).json('There was a problem querying the database')
    }

    if(queryResult.rows){
        res.json(queryResult.rows);
    }
}

// create new item feedback
const createNewItemFeedback = (req,res, queryResult) => {
    if(queryResult === 500){
        res.status(500).json('An error occured on the server please try again.')
    }

    if(queryResult === 400) {
        res.status(400).json('An error occured while querying the database.')
    }

    if(queryResult === 200) {
        res.json('New item successfully added')
    }
}

//update item fedback
const updateItemFeedback = (req,res,queryResult) => {
    if(queryResult === 500){
        res.status(500).json('An error occured on the server please try again.')
    }

    if(queryResult === 400) {
        res.status(400).json('An error occured while querying the database.')
    }

    if(queryResult === 404){
        res.status(404).json('Item was not found for update')
    }

    if(queryResult === 200) {
        res.json('Item successfully updated')
    }
}

//delete item feedback

const deleteItemFeedback = (req,res,queryResult) => {
    if(queryResult == 500){
        res.status(500).json('An error occured on the server, please try again')
    }

    if(queryResult === 400) {
        res.status(400).json('There was a problem querying the database')
    }

    if(queryResult === 404) {
        res.status(404).json('Item with that id was not fond to delete')
    }

    if(queryResult === 204) {
        res.status(204).json('Item succesfully deleted.')
    }
}


module.exports = {
    generateId,
    hashPassword,
    isValidPassword,
    genToken,
    selectAllItemsFeeback,
    createNewItemFeedback,
    updateItemFeedback,
    deleteItemFeedback
}