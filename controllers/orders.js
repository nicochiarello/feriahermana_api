const Order = require("../models/orders");
const User = require("../models/user");
const Products = require("../models/product");
const { checkStock } = require("../utils/checkStock");
const { mpPreference } = require("../utils/mpPreference");
const { updateProductStatus } = require("../utils/updateProductStatus");
require("dotenv").config();

// SDK de Mercado Pago
const mercadopago = require("mercadopago");

// Agrega credenciales
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

exports.delete = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.status(200).json("all orders were deleted");
  } catch (error) {
    res.status(400);
  }
};

exports.getAll = async (req, res) => {
  try {
    const getAll = await Order.find();

    res.status(200).json({ orders: getAll });
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.createOrder = async (req, res) => {
  try {
    // Checks if some of the products are already reserved
    const stock = await checkStock(req.body.products);

    if (!stock) {
      throw new Error("stock");
    }

    const orderReceived = {
      products: req.body.products,
      author: req.userId,
      total: req.body.total,
      shipping: req.body.directionShipping,
      shippingPrice: req.body.shippingPrice,
      mobile: req.body.mobile,
      payment: req.body.shipping,
    };

    let createdMpPreference = await mpPreference(orderReceived);

    let order = await new Order({...orderReceived, shipping: "test"});

    let user = await User.findByIdAndUpdate(req.userId, {
      mobile: req.body.mobile,
      dni: req.body.dni,
      name: req.body.name,
    });

    (user.orders = [...user.orders, order._id]), await user.save();
    // await order.populate("author");

    await updateProductStatus(orderReceived);
    await order.save()

    if (req.body.shipping === "Mercado pago") {
      const responseMP = await mercadopago.preferences.create(
        createdMpPreference
      );
      console.log(responseMP);
      res.status(200).json({
        msg: "Order Created",
        order: order,
        mp: responseMP.response.init_point,
      });
    } else {
      res.status(200).json({
        msg: "Order Created",
        order: order,
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
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

exports.deleteSingleOrder = async (req, res) => {
  try {
    // const deleteProducts = async () => {
    //   req.body.products.forEach(async (i) => {
    //     if (i.images) {
    //       for (let image of i.images) {
    //         await cloudinary.v2.uploader.destroy(
    //           image.publicId,
    //           function (error, result) {
    //             console.log(result, error);
    //           }
    //         );
    //       }
    //     }
    //     await Products.findByIdAndDelete(i._id);
    //   });
    // };
    // await deleteProducts();
    // console.log(req.body);
    // const deleteOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order and products deleted");
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
