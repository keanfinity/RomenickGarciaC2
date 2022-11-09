const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productBrand: {
        type: String,
        required: [true, "Please enter a PRODUCT BRAND."]
    },
    productName: {
        type: String,
        required: [true, "Please enter a PRODUCT NAME."]
    },
    productType: {
        type: String,
        required: [true, "Please enter a PRODUCT TYPE."]
    },
    productModel: {
        type: String,
        required: [true, "Please enter a PRODUCT MODEL."]
    },
    description: {
        type: String,
        required: [true, "Please enter a PRODUCT DESCRIPTION."]
    },
    price: {
        type: Number,
        required: [true, "Please enter a PRODUCT PRICE."]
    },
    stocks: {
        type: Number,
        required: [true, "Please enter a PRODUCT STOCKS."]
    },
    imgSource: {
        type: String,
        required: [true, "Please enter a PRODUCT IMG."]
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    orders: [{
        userId: {
            type: String,
            required: [true, "Please enter a USER ID."]
        },
        userEmail: {
            type: String,
            required: [true, "Please enter a USER EMAIL."]
        },
        quantity: {
            type: Number,
            required: [true, "Please enter an ORDER QUANTITY."]
        },
        purchasedOn: {
            type: Date,
            default: new Date()
        },
    }]
})

module.exports = mongoose.model("Product", productSchema);