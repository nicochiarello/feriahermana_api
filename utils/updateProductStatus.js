const Products = require("../models/product");

exports.updateProductStatus = async (products) => {
  products.forEach(
    async (i) =>
      await Products.findByIdAndUpdate(i._id, {
        view: false,
        reserved: true,
      })
  );

  return;
};
