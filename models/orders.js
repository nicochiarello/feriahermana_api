const mongoose = require('mongoose')
const OrderSchema = mongoose.Schema(
  {
    products: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    direction: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: false,
    },
    shipping: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema)