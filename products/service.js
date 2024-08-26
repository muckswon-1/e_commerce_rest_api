const { db } = require("../config/database/db");
const {
  insertIntoTable,
  getAllTableItems,
  updateById,
  deleteFromTable,
  selectById,
} = require("../config/database/service");
const {
  generateId,
  createNewItemFeedback,
  selectAllItemsFeeback,
  updateItemFeedback,
  deleteItemFeedback,
  selectByIdFeedback,
} = require("../utils");

//retrieve all products
const getAllProducts = async (req, res) => {
  const queryResult = await getAllTableItems("products");
  selectAllItemsFeeback(req, res, queryResult);
};

// add a new product
const createNewProduct = async (req, res) => {
  const newProductId = generateId();
  const newProduct = req.body;
  newProduct.id = newProductId;
  const queryResult = await insertIntoTable("products", newProduct);
  createNewItemFeedback(req, res, queryResult);
};

//update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateProduct = req.body;
  const queryResult = await updateById("products", updateProduct, "id", id);
  updateItemFeedback(req, res, queryResult);
};

//delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const queryResult = await deleteFromTable("products", id);
  deleteItemFeedback(req, res, queryResult);
};

const getProduct = async (req,res) => {
  const {id} = req.params;
  const queryResult = await selectById('products',id,'id');
  selectByIdFeedback(req,res,queryResult)
}

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getProduct
};
