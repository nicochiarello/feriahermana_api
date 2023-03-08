const mongoose = require('mongoose')
const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "El campo nombre es requerido"]
    }
})

module.exports = mongoose.model("Categories", CategorySchema)