const express = require("express");
const router = express.Router();

const userControllers = require("../controllers/userControllers.js");
const auth = require("../auth.js");

//USER REGISTRATION
console.log(userControllers);
router.post("/register", userControllers.registerUser);

//USER REGISTRATION EMAIL CHECK
router.post("/checkEmail", userControllers.checkEmailExists);

//USER LOGIN AND AUTHENTICATION
router.post("/login", userControllers.loginUser);

//UPDATE USER AS ADMIN
router.put("/updateUser/:id", userControllers.updateUser);

//CHECKOUT CUSTOMER
router.post("/checkout", auth.verify, userControllers.checkout);

//CUSTOMERS INFO CUSTOMER
router.get("/profile", auth.verify, userControllers.retriveUser);

//ALL ORDERS ADMIN
router.get("/allOrders", auth.verify, userControllers.allOrders);

//MY ORDERS
router.get("/myOrders", auth.verify, userControllers.myOrders);

module.exports = router;