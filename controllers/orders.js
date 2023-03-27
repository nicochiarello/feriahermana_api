const Order = require("../models/orders");
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
    const currentPage = req.query.page || 1;
    const perPage = req.query.items || 24;
    const totalItems = await Order.find().countDocuments();

    const getAll = await Order.find()
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("products");

    res.status(200).json({
      orders: getAll,
      nbHits: getAll.length,
      nbPages: Math.ceil(totalItems / perPage),
      totalItems: totalItems,
      currentPage,
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.orderInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const foundOrder = await Order.findById(id).populate("products");
    res.status(200).json(foundOrder);
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

    let order = await new Order(req.body);
    let createdMpPreference = await mpPreference(req.body, order._id);

    await updateProductStatus(req.body.products);
    await order.save();

    const responseMP = await mercadopago.preferences.create(
      createdMpPreference
    );

    res.status(200).json({
      msg: "Order Created",
      order: order,
      mp: responseMP.response.init_point,
    });
  } catch (error) {
    res.status(500).json(error.errors);
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
