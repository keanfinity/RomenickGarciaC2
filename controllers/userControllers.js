const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Product = require("../models/Product.js")


// Check email exists
module.exports.checkEmailExists = (req, res) => {
    return (User.find({ email: req.body.email })).then(result => {
        console.log(result);
        if (result.length > 0) {
            return res.send(true);
        } else {
            return res.send(false);
        }
    })
        .catch(error => res.send(error))
}



//User registration -> Creation of new account and confirmation if user is already existing
module.exports.registerUser = (req, res) => {

    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        mobileNumber: req.body.mobileNumber
    });

    console.log(newUser);

    return User.find({ email: req.body.email })
        .then(result => {
            console.log(result);

            if (result.length > 0) {
                //return res.send(true);
                return res.send(result);
            } else {
                //return res.send(false);
                return newUser.save()
                    .then(user => {
                        console.log(user);
                        return res.send(true);
                    })
                    .catch(error => {
                        console.log(error);
                        res.send(false);
                    })
            }
        })
        .catch(error => res.send(error));

}

//User login -> credential validation
module.exports.loginUser = (req, res) => {
    return User.findOne({ email: req.body.email })
        .then(result => {
            if (result == null) {
                return res.send(true);
            } else {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
                if (isPasswordCorrect) {
                    return res.send({ accessToken: auth.createAccessToken(result) });

                } else {
                    return res.send(false);
                }
            }
        })
}

//Update user as ADMIN
//If the user is already an admin, the system will throw an error stating that the current user is already an admin.
module.exports.updateUser = (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {
        let updateUser = {
            isAdmin: req.body.isAdmin
        }
        return User.findById(req.params.id, updateUser, { new: true })
            .then(result => {
                if (result.isAdmin) {
                    console.log(result);
                    res.send("ERROR: The user you are trying to update is already an admin.");
                } else {
                    User.findByIdAndUpdate(req.params.id, updateUser, { new: true })
                        .then(result => {
                            result.orders = [];
                            console.log(result);
                            res.send(result);
                        })
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

//Checkout module
module.exports.checkout = async(req, res) => {
    const userData = auth.decode(req.headers.authorization);

    if (userData.isAdmin) {
        return res.send("ERROR: Only Customers can access this page!");
    } else {
        let productName = await Product.findById(req.body.productId)
            .then(result => result);

        let data = {
            userId: userData.id,
            email: userData.email,
            productName: productName,
            quantity: req.body.quantity
        }
        let isUserUpdated = await User.findById(data.userId)
            .then(user => {
                user.orders.push({
                    totalAmount: req.body.totalAmount,
                    purchasedOn: new Date(),
                    products: req.body.products,

                });
                return user.save()
                    .then(result => {
                        console.log(result);
                        return true;
                    })
                    .catch(error => {
                        console.log(error);
                    })
            });
        let isProductUpdated;
        for (let countProduct = 0; countProduct < req.body.products.length; countProduct++) {
            let data = {
                userId: userData.id,
                userEmail: userData.email,
                productId: req.body.products[countProduct].productId,
                quantity: req.body.products[countProduct].quantity
            };

            isProductUpdated = await Product.findById(data.productId)
                .then(product => {
                    if (product.stocks > data.quantity) {
                        product.orders.push({
                            userId: data.userId,
                            userEmail: data.userEmail,
                            quantity: data.quantity
                        })
                        product.stocks -= data.quantity;
                        return product.save()
                            .then(result => {
                                console.log(result);
                                return true;
                            })
                            .catch(error => {
                                console.log(error);
                                return "ERROR: Something is wrong with the current purchase status!";
                            })
                    } else {
                        res.send("ERROR: Sorry we ran out of stocks.");
                        return true;

                    }

                })
            console.log(isProductUpdated);
        }
        if (isUserUpdated && isProductUpdated) {
            return res.send(true);
        } else {
            return "ERROR: Something is wrong with the current purchase status!";
        }
    }

}


//view user info
module.exports.retriveUser = (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {
        console.log(userData.id)
        return User.findById(userData.id).then(result => {
            return res.send(result);
        });
    } else {
        console.log(userData.id)
        return User.findById(userData.id).then(result => {
            return res.send(result);
        });
    }
}

//User Orders
module.exports.myOrders = (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {
        return res.send("ERROR: Only customers can access this page!");
    }
    return User.findById(userData.id).then(result => {
        return res.send(result.orders);
    })
}

//view all orders
module.exports.allOrders = (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    if (userData.isAdmin) {

        return User.distinct("orders").then(result => {
            return res.send(result);
        });
    } else {
        return res.send("ERROR: You cannot access this page!");
    }
}