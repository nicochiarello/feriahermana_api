const Products = require("../models/product");

exports.updateProductStatus = async (order) => {
  console.log(order);
  order.products.forEach(
    async (i) =>
      await Products.findByIdAndUpdate(i._id, {
        view: false,
        reserved: true,
      })
  );

  return;
};
