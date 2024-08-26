require("dotenv").config();
const express = require("express");
const { ordersRouter } = require("./orders/orders");
const { initDatbase } = require("./config/database/db");
const productsRouter = require("./products/products");
const app = express();
const PORT = process.env.SERVER_PORT;
const cors = require("cors");
const morgan = require("morgan");
const usersRouter = require("./users/users");
const authRouter = require("./auth/auth");
const passport = require("passport");
const session = require("express-session");
const cartRouter = require("./cart/cart");
const checkoutRouter = require("./checkout/checkout");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

initDatbase();

app.get("/", (req, res) => {
  res.json("Welcome to E-commerce");
});

app.use("/", ordersRouter);
app.use("/", productsRouter);
app.use("/", usersRouter);
app.use("/", authRouter);
app.use("/", cartRouter);
app.use("/", checkoutRouter);

app.listen(PORT, () => {
  console.log(`E-commerce app runnig at http://localhost:${PORT}`);
});
