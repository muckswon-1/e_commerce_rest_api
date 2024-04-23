const { db } = require("../config/database/db");
const {
  getAllTableItems,
  updateById,
  deleteFromTable,
} = require("../config/database/service");
const {
  generateId,
  selectAllItemsFeeback,
  updateItemFeedback,
  deleteItemFeedback,
} = require("../utils");

//get all users

const getAllUsers = async (req, res) => {
  const queryResult = await getAllTableItems("users");
  selectAllItemsFeeback(req, res, queryResult);
};

//update a user

const updateUser = async (req, res) => {
  const { id } = req.params;
  const userUpdate = req.body;
  const queryResult = updateById("users", userUpdate, "id", id);
  updateItemFeedback(req, res, queryResult);
};

//delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const queryResult = await deleteFromTable("users", id);
  deleteItemFeedback(req, res, queryResult);
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
};
