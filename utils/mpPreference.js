const Products = require("../models/product");

exports.mpPreference = async (order) => {
  let items = [];
  for (let product of order.products) {
    let item = await Products.findById(product);
    items.push({ title: item.name, unit_price: item.price, quantity: 1 });
  }
  let preference = {
    items,
    back_urls: {
      failure: "",
      pending: "",
      success: `feriahermana.com/verify/true?payment=mercadopago&direction=${order.shipping}`,
    },
    auto_return: "approved",
  };

  preference.items.push({
    title: "Envío",
    unit_price: order.shippingPrice,
    quantity: 1,
  });

  return preference;
};
