require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.SERVER_PORT;


app.get('/',(req,res) => {
    res.json('Welcome to E-commerce');
});



app.listen(PORT,() => {
    console.log(`E-commerce app runnig at http://localhost:${PORT}`);
})