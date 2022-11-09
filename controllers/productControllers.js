const Product = require("../models/Product.js");
const auth = require("../auth.js");



//Adding products -> Admin Only
//Duplication of product is not allowed
module.exports.addProduct = (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {
        let newProduct = new Product({
            productBrand: req.body.productBrand,
            productName: req.body.productName,
            productType: req.body.productType,
            productModel: req.body.productModel,
            description: req.body.description,
            price: req.body.price,
            stocks: req.body.stocks,
            imgSource: req.body.imgSource,
        });
        return Product.findOne({ productBrand: req.body.productBrand, productName: req.body.productName, productModel: req.body.productModel })
            .then(result => {
                console.log(result);
                if (result == null) {
                    newProduct.save()
                        .then(product => {
                            console.log(product);
                            return res.send(true);
                        })
                        .catch(err => {
                            console.log(err);
                            return res.send("ERROR: Some fields may not be filled, please try again!");
                        });
                } else {
                    return res.send("ERROR: The Product is already existing!");
                }
            });
    } else {
        return res.send("ERROR: You cannot access this page!");
    }
}

//retrieve all active products
module.exports.getAllActiveProducts = (req, res) => {
    return Product.find({ isActive: true }).then(result => {
        result.orders = [];
        return res.send(result)
    });

}

//retrieve all products -> admin
module.exports.getAllProducts = (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {
        return Product.find({}).then(result => {
            result.orders = [];
            return res.send(result);
        });
    } else {
        return res.send("ERROR: You cannot access this page!");
    }
}


//retrieve all products -> admin
//If the ID is incorrect -> system will throw an error stating that the ID provided is incorrect -> cannot find product with the ID
module.exports.getSpecificProduct = (req, res) => {
    console.log(req.params.productId);
    return Product.findById(req.params.productId).then(result => {
            result.orders = [];
            if (result) {
                return res.send(result);
            } else {
                return res.send("ERROR: Cannot find product with the ID provided.");
            }
        })
        .catch(error => {
            console.log(error);
            res.send("ERROR: Something is wrong with the data provided.");
        });
}

//Updating product info - Admin
// ***** NOT YET WORKING -> Checking if there are changes. //Plan is -> if there is no changes to the product info, user should receive message -> No changes is detected
module.exports.updateProduct = (req, res) => {
    let updateProduct = {
        productBrand: req.body.productBrand,
        productName: req.body.productName,
        productType: req.body.productType,
        productModel: req.body.productModel,
        imgSource: req.body.imgSource,
        description: req.body.description,
        price: req.body.price,
        stocks: req.body.stocks,
        isActive: req.body.isActive

    }
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {

        return Product.findById(req.params.productId)
            .then(result => {
                console.log(updateProduct);
                if (result != updateProduct) {
                    Product.findByIdAndUpdate(req.params.productId, updateProduct, { new: true })
                        .then(result => {
                            console.log(result);
                            res.send(result);
                        })
                } else {
                    console.log(result);
                    res.send("ERROR: No changes is detected.");
                }
            })
            .catch(error => {
                console.log(error);
                res.send("ERROR: Something is wrong with the data provided.");
            });
    } else {
        res.send("ERROR: You cannot access this page!");
    }
}

//Archive Product
//if the product is already in archive -> user should receive a message -> The products is already in archive
module.exports.archiveProduct = (req, res) => {
    let archiveProduct = {
        isActive: req.body.isActive

    }
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {

        return Product.findById(req.params.productId)
            .then(result => {
                console.log(archiveProduct);
                if (result.isActive != archiveProduct.isActive) {
                    Product.findByIdAndUpdate(req.params.productId, archiveProduct, { new: true })
                        .then(result => {
                            console.log(result);
                            return res.send(result);
                        })
                } else if (result.isActive == false) {
                    console.log(result);
                    res.send("ERROR: The products is already in archive.");
                } else if (result.isActive == true) {
                    console.log(result);
                    res.send("ERROR: The products is already active.");
                }
            })
            .catch(error => {
                console.log(error);
                res.send("ERROR: Something is wrong with the data provided.");
            });
    } else {
        res.send("ERROR: You cannot access this page!");
    }
}

//View archives -> all soft deleted products
module.exports.archives = (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {
        return Product.find({ isActive: false }).then(result => res.send(result));
    } else {
        return res.send("ERROR: You cannot access this page!");
    }
}