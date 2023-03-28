const Products = require("../models/product");

exports.mpPreference = async (order, orderId) => {
  let items = [];
  for (let product of order.products) {
    let item = await Products.findById(product);
    items.push({ title: item.name, unit_price: item.price, quantity: 1 });
  }
  let link = "www.feriahermana.com/orden/" + order._id
  let preference = {
    items,
    back_urls: {
      failure: "",
      pending: "",
      success: link,
    },
    auto_return: "approved",
    metadata: {
      orderId: orderId,
    }
  };

  return preference;
};
