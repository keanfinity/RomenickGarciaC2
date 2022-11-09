const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter a FIRST NAME."]
    },
    lastName: {
        type: String,
        required: [true, "Please enter a LAST NAME."]
    },
    email: {
        type: String,
        required: [true, "Please enter an EMAIL"]
    },
    password: {
        type: String,
        required: [true, "Please enter a PASSWORD"]
    },
    mobileNumber: {
        type: String,
        required: [true, "Please enter a MOBILE NUMBER"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    orders: [{
        totalAmount: Number,
        purchasedOn: {
            type: Date,
            default: new Date()
        },
        products: [{
            productId: {
                type: String,
                required: [true, "PRODUCT ID is needed."]
            },
            productName: {
                type: String,
                required: [true, "PRODUCT NAME is needed."]
            },
            quantity: {
                type: Number,
                required: [true, "PRODUCT QUANTITY is needed."]
            },
        }]

    }]
});

module.exports = mongoose.model("User", userSchema);