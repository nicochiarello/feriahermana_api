const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    required: false,
  },
  mobile: {
    type: Number,
    required: false,
  },
  dni: {
    type: String,
    required: false,
  },
  cart: {
    type: Array,
    required: false,
    default: [],
  },
  orders: {
    type: [mongoose.Types.ObjectId],
    ref: "Orders",
    required: false,
    
  },
});

module.exports = mongoose.model("Users", UserSchema);
