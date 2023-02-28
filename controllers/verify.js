const axios = require("axios");
const Order = require("../models/orders");

exports.verifyOrderStatus = async (req, res) => {
  // El id estara en req.body.data.id
  let mp_id = req.body.data.id;
  axios
    .get(`https://api.mercadopago.com/v1/payments/${mp_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    })
    .then(async (response) => {
      let orderId = response.data.metadata.order_id;
      if (response.data.status === "approved") {
        // Cambiar estado de orden
        await Order.findByIdAndUpdate(orderId, { state: 1 });
        return res.status(200).json({ oki: "doki" });
      } else {
        await Order.findByIdAndUpdate(orderId, { status: 2 }); 
        return res.status(200).json({ oki: "doki" });
      }
    });

};
