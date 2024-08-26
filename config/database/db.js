require("dotenv").config();
const { Pool } = require("pg");

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};



const db = new Pool(config);

//method to initialize a database

const initDatbase = async () => {
  let client;

  try {
    client = await db.connect();
    console.log("Connected to database successfully.");
  } catch (error) {
    console.log("Connection error:", error.stack);
    throw error;
  }

  // check if database exisits
  const databaseExistsQuery =
    "SELECT 1 FROM pg_catalog.pg_database WHERE  datname = $1";

  try {
    const result = await client.query(databaseExistsQuery, [config.database]);
    const databaseExists = result.rows.length > 0;

    if (!databaseExists) {
      const createDatabaseQuery = "CREATE DATABASE $1";
      await client.query(createDatabaseQuery, [config.database]);
      console.log("Database created successfully");
    } else {
      console.log("Databse already exists");
    }
  } catch (error) {
    console.error("Error checking or creating database:", error.stack);
    throw error;
  }

  try {
    //create users table
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users(
           id UUID NOT NULL UNIQUE PRIMARY KEY,
           username VARCHAR(255) NOT NULL UNIQUE,
           email VARCHAR(255) NOT NULL UNIQUE,
           password TEXT NOT NULL
        )
       `;
    await client.query(createUsersTableQuery);
    console.log("Users table created successfully (if it didn't exist).");

    // create products table
    const createProductsTableQuery = `
         CREATE TABLE IF NOT EXISTS products(
             id UUID NOT NULL UNIQUE PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             unit_price REAL NOT NULL,
             quantity INTEGER NOT NULL)
         `;
    await client.query(createProductsTableQuery);
    console.log("Products table created successfully (if it didn't exist).");

    // create orders table
    const createOrdersTableQuery = `
        CREATE TABLE IF NOT EXISTS orders(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            shipping_address TEXT,
            payment_method VARCHAR(50),
            payment_details JSONB,
            state VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            shipped_at TIMESTAMP WITH TIME ZONE,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
            
        `;
    await client.query(createOrdersTableQuery);
    console.log("Orders table created successfully (if it didn't exist).");

    // create order_items table
    const createOrderItemsTableQuery = `
            CREATE TABLE IF NOT EXISTS order_items (
                id UUID PRIMARY KEY,
                order_id UUID REFERENCES orders(id) NOT NULL,
                quantity INT NOT NULL,
                unit_price DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
    await client.query(createOrderItemsTableQuery);
    console.log("Order_items table created successfully (if it didn't exist).");

    // create a cat table
    const createCartTableQuery = `
          CREATE TABLE IF NOT EXISTS cart(
            id UUID PRIMARY KEY,
            user_id UUID REFERENCES users(id) NOT NULL,
            product_id UUID REFERENCES products(id) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          )
        `;
    await client.query(createCartTableQuery);
    console.log("cart table created successfully (if it didn't exist).");
  } catch (error) {
    console.error("Error creating tables:", error.stack);
    throw error;
  } finally {
    await client.release();
    console.log("Connection pool closed.");
  }
};

module.exports = { db, initDatbase };
