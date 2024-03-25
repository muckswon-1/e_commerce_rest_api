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

module.exports = {db}