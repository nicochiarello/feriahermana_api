const axios = require("axios");
const Order = require("../models/orders");

exports.verifyOrderStatus = async (req, res) => {
  // El id estara en req.body.data.id
    let mp_id = req.body.data.id;
    axios
      .get(`https://api.mercadopago.com/v1/payments/${mp_id}`, {
        headers: {
          Autorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      })
      .then(async (res) => {
        if (res.status === "approved") {
          // Cambiar estado de orden
          // El id de la orden esta en res.metadata.orderId
          let orderId = res.metadata.orderId;
          await Order.findByIdAndUpdate(orderId, { status: 1 });
          return res.status(200).json({oki: "doki"})
        } else {
          // otra cosa
          let orderId = res.metadata.orderId;
          await Order.findByIdAndUpdate(orderId, { status: 3 });
          return res.status(200).json({oki: "doki"})
        }
      });
  console.log(req)
  return res.status(200).json({ oki: "doki" });
};

exports.test = () => {};
