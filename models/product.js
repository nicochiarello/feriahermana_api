const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[ true, "Debe ingresar el campo nombre"],

    },
    price: {
        type: Number,
        required:[ true, "Debe ingresar el campo precio"],
    },
    images: {
        type: Object,
        required: false
    },
    description:{
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: false,
        default: 0
    },
    size: {
        type: String,
        required:[ true, "Debe ingresar el campo talle"],
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
        required: false,
    },
    reserved: {
        type: Boolean,
        required: false,
        default: false,
    }

},{timestamps: true})

module.exports = mongoose.model("Products", ProductSchema)