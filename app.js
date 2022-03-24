const express = require("express");
const app = express();



app.use(express.json())

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token:"TEST-4118311813066874-032322-792fbd5a35ee362bd406466a107faae5-659536649",
});

app.get('/', (req,res)=>{
  res.status(200).send('welcome to the api')

})

app.get("/verify", async (req,res) => {
    console.log({req,res})
    res.status(200).json({ req, res }).send({req});
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
      };
      const response = await mercadopago.preferences.create(preference);
      const preferenceId = response.body.id
      res.status(200).json(response)
    } catch (error) {
        
    }
})

let PORT = process.env.PORT || 8080


app.listen(8080, () => {
  console.log(`server running on port 8080 ${PORT}`);
});
