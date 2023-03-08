const mongoose = require("mongoose");
const shippingPriceSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, "El campo precio es requerido"],
  },
});

const ShippingPrice = mongoose.model("ShippingPrice", shippingPriceSchema);

const handlePriceCreation = async () => {
  const foundPrice = await ShippingPrice.find({});
  if (!foundPrice.length) {
    const createdPrice = ShippingPrice.create({ price: 500 });
  }
};

handlePriceCreation();

module.exports = ShippingPrice;
