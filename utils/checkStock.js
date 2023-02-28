const Products = require("../models/product");

exports.checkStock = async (data) => {
  for (const element of data) {
    const productReceived = await Products.findById(element);
    if (productReceived.reserved === true) {
      return false;
    }
  }

  return true;
};
