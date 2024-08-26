const { db } = require("../config/database/db");
const { selectById } = require("../config/database/service");
const {
  generateId,
  hashPassword,
  selectByIdFeedback,
  generateAccessToken,
  generateRefreshToken,
} = require("../utils");
const jwt = require('jsonwebtoken');

//user login
const loginUser = async (req, res) => {
  try {
    if (req.user) {
      const user = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
      };
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.status(200).json({jwtToken: {accessToken, refreshToken}, userId: user.id});
      
    } else {
      res.status(401).json('Incorrect username or password')
    }

    
  } catch (error) {
     console.error('Error while attempting to login')
     res.status(500).json('An error occured on the server. Please try again.')
  }
};

//create a new user
const registerNewUser = async (req, res) => {
  const { username, email, password } = req.body;

  // hash password
  let secretPassword;
  try {
    secretPassword = await hashPassword(password);
  } catch (error) {
    console.error('Error hashing password:', error);
    return res.status(500).json('Internal server error while hashing password')
  }
   
  
  const id = generateId();
  const sqlQuery =
    "INSERT INTO users(id,username,email,password) VALUES($1,$2,$3,$4)";
  let client;
  try {
    client = await db.connect();
    const result = await client.query(sqlQuery, [
      id,
      username,
      email,
      secretPassword,
    ]);

    if (result.rowCount > 0) 
    {
      res.sendStatus(201);

    } else {
      console.error('No rows affected');
      res.status(500).json("Failed to create new user.");
    }

  } catch (error) {
    console.error("Database query error:", error.message);
    let errorMessage;
    if(error.message.includes('duplicate key value violates unique constraint "users_username_key')){
      errorMessage = 'Username already exists';
    }

    if(error.message.includes('duplicate key value violates unique constraint "users_email_key')){
      errorMessage = 'Email already exists'
    }
    res.status(500).json(errorMessage);
  } finally {
    if(client){
      client.release();
    }
    
  }
};

//user logout
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json("Error loggin out");
    }

    res.json(true);
  });
};

//get a users information
const getUserById = async (req, res) => {
  const { id } = req.params;
  const queryResult = await selectById("users", id, "id");
  selectByIdFeedback(req, res, queryResult);
};

const authorizeToken = async (req,res) => {
  res.sendStatus(200);
}

const refreshTokenPath = async (req,res) => {
  const incomingRefreshToken = req.body.refreshToken;

  if(!incomingRefreshToken){
    return res.status(401).json('Refresh token not found');
  }

  try {
    const tokenSecret = process.env.SESSION_SECRET;

    const decoded = jwt.verify(incomingRefreshToken, tokenSecret );
    console.log('refresh decoded', decoded)
    const user = decoded;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({accessToken, refreshToken});
    
  } catch (error) {
    res.status(401).json('Invalid refresh token.')
  }

}


module.exports = {
  registerNewUser,
  loginUser,
  logoutUser,
  getUserById,
  authorizeToken,
  refreshTokenPath
};
