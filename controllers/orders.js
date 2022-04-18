const Order = require("../models/orders");
const mongoose = require("mongoose");
const User = require("../models/user");
const axios = require("axios");
const Products = require('../models/product')

const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: "AKIA6HK2ZBTX6HAF54SA",
  secretAccessKey: "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",
  ACL: "public-read",
});

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
const { Axios } = require("axios");
const orders = require("../models/orders");
// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-5151941510199624-041814-2be53e0631790c1fbd0298471517be3d-223096958",
});

exports.delete = async (req, res) => {
  try {
    const deleteAll = await Order.deleteMany({});
    res.status(200).json("all orders were deleted");
  } catch (error) {
    res.status(400);
  }
};

exports.getAll = async (req, res) => {
  try {
    const getAll = await Order.find({}).sort("-createdAt").populate("author");

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
      direction: req.body.directionUser,
      shipping: req.body.directionShipping,
      shippingPrice: req.body.shippingPrice,
      mobile: req.body.mobile,
      payment: req.body.shipping,
 
    };
    console.log(orderReceived);
    let mpPreference = {
      items: [],
      back_urls: {
        failure: "",
        pending: "",
        success:
          `http://localhost:3000/verify/true?payment=mercadopago&direction=${orderReceived.shipping}`,
      },
      auto_return: "approved"
      // notification_url:
      //   "https://feriahermana-api.herokuapp.com/api/orders/verify?source_news=ipn",
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
  
    const updateUser = await User.findByIdAndUpdate(req.body.author, {
      mobile: req.body.mobile,
      direction: req.body.directionUser,
      dni: req.body.dni,
      name: req.body.name,
      zip: req.body.zip
    });
    const updateOrder = await User.findById(req.body.author);

    await updateOrder.orders.push(order._id);
    await updateOrder.save();
    await order.save();
    await order.populate("author");
    const updateProducts = () => {
      orderReceived.products.forEach(async (i)=> await Products.findByIdAndUpdate(i._id, {view: false, reserved: true}))
    } 

    await updateProducts()
    if (req.body.shipping === "Mercado pago") {
      const responseMP = await mercadopago.preferences.create(mpPreference);
      res.status(200).json({
        msg: "order Created",
        order: order,
        mp: responseMP.response.init_point,
      });
    } else {
      res.status(200).json({
        msg: "order Created",
        order: order,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

exports.verify = (req, res) => {
  try {


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

    mercadopago.payment.save(payment_data).then(function (response) {
      console.log(response);
      res.status(response.status).json({
        status: response.body.status,
        status_detail: response.body.status_detail,
        id: response.body.id,
      });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};



exports.deleteSingleOrder = async (req,res) => {
  try {
    const deleteProducts = async () => {
      req.body.products.forEach(async (i)=> {
        let product =  await Products.findById(i._id)
        const params = {
          Bucket: "feria-hermana",
          Key: product.img.split(".com/")[1],
        };
        console.log(params);
        s3.deleteObject(params, (err, data) => {
          console.error(err);
          console.log(data);
          console.log(product.img.split(".com/")[1]);
        });
        await product.delete()

      })
    }
    await deleteProducts()
    console.log(req.body);
    const deleteOrder = await Order.findByIdAndDelete(req.params.id)
    res.status(200).json("Order and products deleted")
  } catch (error) {
    console.log(error);
    res.status(400).json({error})
  }
}