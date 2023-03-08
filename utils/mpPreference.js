const Products = require("../models/product");

exports.mpPreference = async (order, orderId) => {
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
    metadata: {
      orderId: orderId,
    }
  };

  preference.items.push({
    title: "Envío",
    unit_price: 1000,
    quantity: 1,
  });

  return preference;
};
