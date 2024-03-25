require('dotenv').config();
const express = require('express');
const { ordersRouter } = require('./orders/orders');
const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/',(req,res) => {
    res.json('Welcome to E-commerce');
});

app.use('/orders',ordersRouter);


app.listen(PORT,() => {
    console.log(`E-commerce app runnig at http://localhost:${PORT}`);
})