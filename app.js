const express = require("express");
const app = express();



app.use(express.json())

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token:"TEST-4118311813066874-032322-792fbd5a35ee362bd406466a107faae5-659536649",
});



app.post("/verify", async (req,res) => {
  let notifications = {
    req: req
  }
    console.log({req,res})
    res.status(200).json({ req: req, res: res }).send({req});
})

app.post("/pay", async (req,res) => {
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
      const preferenceId = response.body.id
      res.status(200).json(response)
    } catch (error) {
        
    }
})

app.get("/", (req, res) => {
  res.status(200).json("welcome to the api");
});

let PORT = process.env.PORT || 8080


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
