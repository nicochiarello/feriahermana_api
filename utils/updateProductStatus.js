const Products = require("../models/product");

exports.updateProductStatus = async (products) => {
  for (let product of products) {
    await Products.findByIdAndUpdate(product, {
      reserved: true,
    });
  }

  return;
};
