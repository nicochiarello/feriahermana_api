const Order = require("../models/orders");
const mongoose = require("mongoose");
const User = require("../models/user");
const axios = require('axios')

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
const { Axios } = require("axios");
// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-4118311813066874-032322-c78f760dfd1e2490d6aeb2776d239e93-659536649",
});

exports.getAll = async (req, res) => {
  try {
    const getAll = await Order.find({});
    res.status(200).json({ orders: getAll });
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderReceived = {
      products: req.body.products,
      author: req.body.author,
      total: req.body.total,
      direction: req.body.direction,
      shipping: req.body.shipping,
      shippingPrice: req.body.shippingPrice,
    };

    let mpPreference = {
      items: [],
      back_urls: {
        failure: "",
        pending: "",
        success: "http://localhost:3000/",
      },
      notification_url:
        "https://feriahermana-api.herokuapp.com/api/orders/verify?source_news=ipn",
    };

    orderReceived.products.map((i) =>
      mpPreference.items.push({
        title: i.name,
        unit_price: i.price,
        quantity: 1,
      })
    );

    mpPreference.items.push({
      title: "Envío",
      unit_price: orderReceived.shippingPrice,
      quantity: 1,
    });

    const order = await new Order(orderReceived);
    // console.log(req.body.author)
    const updateOrder = await User.findById(req.body.author);

    await updateOrder.orders.push(order._id);
    await updateOrder.save();
    await order.save();
    await order.populate("author");
    const responseMP = await mercadopago.preferences.create(mpPreference);
    res
      .status(200)
      .json({
        msg: "order Created",
        order: order,
        mp: responseMP.response.init_point,
      });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

exports.verify = (req,res) => {
try {
  console.log({ requestBody: req.body });
  console.log({req: req});
  console.log({res: res});
  console.log({resBody: res.body});


  var payment_data = {
    transaction_amount: Number(req.body.transactionAmount),
    token: req.body.token,
    description: req.body.description,
    installments: Number(req.body.installments),
    payment_method_id: req.body.paymentMethodId,
    issuer_id: req.body.issuer,
    notification_url:
      "https://feriahermana-api.herokuapp.com/api/orders/verify",
    payer: {
      email: req.body.email,
      identification: {
        type: req.body.docType,
        number: req.body.docNumber,
      },
    },
  };

  mercadopago.payment.save(payment_data)
  .then(function(response) {
    console.log(response);
    res.status(response.status).json({
      status: response.body.status,
      status_detail: response.body.status_detail,
      id: response.body.id
    });
  })

  
} catch (error) {
  res.status(500).json({error})
}
} 


