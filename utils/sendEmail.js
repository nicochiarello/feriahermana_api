const nodemailer = require("nodemailer");

const sendEmail = async (order) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "feriahermana22@gmail.com",
      pass: process.env.NODEMAILER_PASS,
    },
  };
  const transport = nodemailer.createTransport(config);
  let link = "www.feriahermana.com/orden" + order._id;
  const message = {
    from: "feriahermana22@gmail.com",
    to: order.email,
    subject: "Confirmación de compra",
    html: `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Feria hermana</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="py-4 bg-gray-300 w-full px-2">
          <h1 class="text-xl">Feria hermana</h1>
        </div>
        <div
          class="w-full h-[calc(100vh-4rem)] bg-white flex gap-4 flex-col justify-between items-center flex-1 py-8"
        >
          <div class="flex flex-col gap-4 items-center">
            <p class="text-2xl font-semibold">Gracias por tu compra!</p>
            <p>Para revisar el estado de la orden haz click en el siguiente link</p>
          </div>
    
          <a href=${link} class="px-6 py-2 bg-pink-300 rounded-xl text-white font-semibold">
            Mi orden
          </a>
        </div>
      </body>
    </html>`,
  };

  const send = await transport.sendMail(message);

  res.status(200).json({ oki: "doki" });
};

module.exports = sendEmail;
