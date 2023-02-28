// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

app.post("/verify", async (req, res) => {
  let notifications = {
    req: req,
  };
  console.log({ req, res });
  res.status(200).json({ req: req, res: res }).send({ req });
});

app.post("/pay", async (req, res) => {
  try {
    // Crea un objeto de preferencia
    let preference = {
      items: [
        {
          title: "Mi producto",
          unit_price: 100,
          quantity: 1,
        },
      ],
      additional_info: "orderId: 25",
      back_urls: {
        failure: "",
        pending: "",
        success: "http://localhost:8080/verify",
      },
      notification_url: "https://feriahermana-api.herokuapp.com/",
    };
    const response = await mercadopago.preferences.create(preference);
    const preferenceId = response.body.id;
    res.status(200).json(response);
  } catch (error) {}
});
