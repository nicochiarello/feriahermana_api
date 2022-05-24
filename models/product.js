const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    description:{
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: false,
        default: 0
    },
    size: {
        type: String,
        required: true
    },
    sale: {
        type: Boolean,
        required: false,
        default: false
    },
    discount: {
        type: Number,
        required: false,
    },
    view: {
        type: Boolean,
        required: true,
    },
    reserved: {
        type: Boolean,
        required: false,
        default: false,
    }

},{timestamps: true})

module.exports = mongoose.model("Products", ProductSchema)