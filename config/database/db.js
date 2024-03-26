require('dotenv').config();
const {Pool} = require('pg')

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE
}

console.log(config);

const db = new Pool(config);


//method to initialize a database

const initDatbase = async() => {

    let client;
   
    try {
        client = await db.connect();
        console.log('Connected to database successfully.')
    } catch (error) {
        console.log('Connection error:',error.stack);
        throw error;
    }

    // check if database exisits
    const databaseExistsQuery = 'SELECT 1 FROM pg_catalog.pg_database WHERE  datname = $1';

    try {
         const result = await client.query(databaseExistsQuery,[config.database]);
         const databaseExists = result.rows.length > 0;

         if(!databaseExists){
            const createDatabaseQuery = 'CREATE DATABASE $1';
            await client.query(createDatabaseQuery,[config.database]);
            console.log('Database created successfully');
         }else {
            console.log('Databse already exists')
         }
    } catch (error) {
        console.error('Error checking or creating database:',error.stack);
        throw error
    }


    try {

        // create orders table
        const createOrdersTableQuery = `
        CREATE TABLE IF NOT EXISTS orders(
            id UUID NOT NULL UNIQUE PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            state VARCHAR(10) NOT NULL)
        `;
        await client.query(createOrdersTableQuery);
        console.log('Orders table created successfully (if it didn\'t exist).');

          // create products table
        const createProductsTableQuery = `
        CREATE TABLE IF NOT EXISTS products(
            id UUID NOT NULL UNIQUE PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price REAL NOT NULL,
            quantity INTEGER NOT NULL)
        `;
        await client.query(createProductsTableQuery);
        console.log('Products table created successfully (if it didn\'t exist).')

        const createUsersTableQuery = `
         CREATE TABLE IF NOT EXISTS users(
            id UUID NOT NULL UNIQUE PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            email VARCHAR(255) NOT NULL UNIQUE,
            password TEXT NOT NULL
         )
        `;
        await client.query(createUsersTableQuery);
        console.log('Users table created successfully (if it didn\'t exist).')


    } catch (error) {
        console.error('Error creating tables:', error.stack);
        throw error
    }finally {
        await client.release();
        console.log('Connection pool closed.')
    }

}


module.exports = {db, initDatbase};