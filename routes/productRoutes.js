const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers.js");
const auth = require("../auth.js");

console.log(productControllers);
//Add product -> Admin only
router.post("/", productControllers.addProduct);
//View all active products
router.get("/", productControllers.getAllActiveProducts);
//View all products -> admin only
router.get("/allProducts", auth.verify, productControllers.getAllProducts);
//View Specific product 
router.get("/search/:productId", productControllers.getSpecificProduct);
//Update product info - admin only
router.put("/updateProduct/:productId", auth.verify, productControllers.updateProduct);
//Archive product  - admin only
router.put("/:productId/archive", auth.verify, productControllers.archiveProduct);
//View Archives -> soft deleted products - admin only
router.get("/archives", auth.verify, productControllers.archives);



module.exports = router;