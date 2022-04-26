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

    shipping: {
        type: String,
        required: true
    },
    payment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema)