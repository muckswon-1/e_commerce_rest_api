const { v4: uuid4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const SALTROUNDS = Number(process.env.SALTROUNDS);

// generate a uuid
const generateId = () => {
  const newId = uuid4();

  return newId;
};

//hash password
const hashPassword = async (password) => {
  const salt = bcrypt.genSaltSync(SALTROUNDS);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

//compare password

const isValidPassword = async (password, secretPassword) => {
  return bcrypt.compareSync(password, secretPassword);
};

const generateAccessToken = (payload) => {
  const secret = process.env.SESSION_SECRET;
  return   jwt.sign(payload, secret, {expiresIn: '1m'})
}

//geneate token
const generateRefreshToken = (payload) => {
   const secret = process.env.SESSION_SECRET;
   return  jwt.sign(payload,secret,{expiresIn: '1d'} );
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return res.status(500).json('Bad token format')
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
  
    return res.status(401).json("Invalid or expired access token")
  }
};

//fetch all items from the databse feedback
const selectAllItemsFeeback = (req, res, queryResult) => {
  if (queryResult == 500) {
    res.status(500).json("An error occured on the server, please try again");
  }

  if (queryResult === 400) {
    res.status(400).json("There was a problem querying the database");
  }

  if (queryResult.rows) {
    res.json(queryResult.rows);
  }
};

// create new item feedback
const createNewItemFeedback = (req, res, queryResult) => {
  if (queryResult === 500) {
    res.status(500).json("An error occured on the server please try again.");
  }

  if (queryResult === 400) {
    res.status(400).json("An error occured while querying the database.");
  }

  if (queryResult === 200) {
    res.json("New item successfully added");
  }
};

//update item fedback
const updateItemFeedback = (req, res, queryResult) => {
  if (queryResult === 500) {
    res.status(500).json("An error occured on the server please try again.");
  }

  if (queryResult === 400) {
    res.status(400).json("An error occured while querying the database.");
  }

  if (queryResult === 404) {
    res.status(404).json("Item was not found for update");
  }

  if (queryResult === 200) {
    res.json("Item successfully updated");
  }
};

//delete item feedback

const deleteItemFeedback = (req, res, queryResult) => {
  if (queryResult == 500) {
    res.status(500).json("An error occured on the server, please try again");
  }

  if (queryResult === 400) {
    res.status(400).json("There was a problem querying the database");
  }

  if (queryResult === 404) {
    res.status(404).json("Item with that id was not fond to delete");
  }

  if (queryResult === 204) {
    res.status(204).json("Item succesfully deleted.");
  }
};

//select by ID feedback
const selectByIdFeedback = (req, res, queryResult) => {
  if (queryResult == 500) {
    res.status(500).json("An error occured on the server, please try again");
  }

  if (queryResult === 400) {
    res.status(400).json("There was a problem querying the database");
  }

  if (queryResult === 404) {
    res.json([]);
  }

  if (queryResult.rows) {
    res.json(queryResult.rows);
  }
};

//calclutate total amount
const calcuclateTotal = (obj1, obj2) => {
  const totals = [];
  for (const item of obj1) {
    let itemTotal = 0;
    for (const entry of obj2) {
      if (entry.id === item.product_id) {
        itemTotal = entry.unit_price * item.quantity;
        totals.push(itemTotal);
      }
    }
  }

  return totals;
};

//get value of a key in an object given an array and the key
const getObjectValue = (array, key, id, idName) => {
  const item = array.find((theItem) => theItem[idName] === id);

  return item[key];
};

module.exports = {
  generateId,
  hashPassword,
  isValidPassword,
  generateAccessToken,
  generateRefreshToken,
  selectAllItemsFeeback,
  createNewItemFeedback,
  updateItemFeedback,
  deleteItemFeedback,
  selectByIdFeedback,
  calcuclateTotal,
  getObjectValue,
  verifyToken
};
