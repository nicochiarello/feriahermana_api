const mongoose = require("mongoose");
const WithdrawalsSchema = new mongoose.Schema({
  day: {
    type: String,
    required: [true, "El campo dia es requerido"],
  },
  description: {
    type: String,
    required: [true, "El campo descripcion es requerido"],
  },
});

const Withdrawals = mongoose.model("Withdrawals", WithdrawalsSchema);

module.exports = Withdrawals;