const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required:[ true, "El campo nombre es requerido"],
      
    },
    email: {
      type: String,
      required:[ true, "El campo email es requerido"],
    },
    phone: {
      type: Number,
      required:[ true, "El campo telefono es requerido"],
    },
    dni: {
      type: Number,
      required:[ true, "El campo dni es requerido"],
    },
    shipping_type: {
      type: Number, // 0: godoy cruz, 1: centro, 2: domicilio
      required:[ true, "El campo tipo de compra es requerido"],
    },
    direction: {
      type: String,
      required: false,
    },
    zip: {
      type: Number, 
      required: false,
    },
    products: {
      type: Array,
      required:[ true, "El campo productos es requerido"],
    },
    total: {
      type: Number,
      required: true,
    },
    payment_status: {
      type: Number,
      default: 0,
      // 0 process
      // 1 approved
      // 2 other
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
