const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");

mongoose.connect("mongodb+srv://keanfinity:kean.zuitt@wdc028-course-booking.52n84dy.mongodb.net/E-CommerceAPI-Garcia?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//connection check
let db = mongoose.connection;
//if con error
db.on("error", console.error.bind(console, "connection error"));
//if con okay
db.once("open", () => console.log("CLOUD DB CONNECTION - OK"));


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//endpoint for users
app.use("/users", userRoutes);
//endpoint for products
app.use("/products", productRoutes);



app.listen(port, () => {
    console.log(`API IS NOW ONLINE ON PORT ${port}`)
});