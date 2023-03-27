const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const categoriesRoutes = require("./routes/categories");
const ordersRoute = require("./routes/orders");
const shippingRoutes = require("./routes/shippingPrice");
const testEmailRoute = require("./routes/test");
const withdrawalsRoutes = require("./routes/withdrawals");
const initialSetup = require("./libs/initialSetup");

//creates initialSetup if not created yet
initialSetup.createRoles();
//creates admin user if not created yet
initialSetup.createUser();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", ordersRoute);
app.use("/api/categories", categoriesRoutes);
app.use("/api/shipping", shippingRoutes);
app.use("/api/withdrawals", withdrawalsRoutes);
app.use("/api/email", testEmailRoute);

app.use("/api", express.static("public"));

mongoose
  .connect("mongodb://localhost:27017/feriahermana")
  .then(() => console.log("db connected"))
  .catch((err) => console.log(err));

let PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
