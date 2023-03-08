const nodemailer = require("nodemailer");

const sendEmail = async (order) => {
  const config = {
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "nicolasch.fcm@gmail.com",
      pass: "yrazaprigjiipqlt",
    },
  };
  const transport = nodemailer.createTransport(config);
  const message = {
    from: "nicolasch.fcm@gmail.com",
    to: order.email,
    subject: "Confirmacion de compra",
    text: "Su compra fue efectuada con exito",
  };

  const send = await transport.sendMail(message);

  res.status(200).json({ oki: "doki" });
};

module.exports = sendEmail;
