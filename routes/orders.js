const express = require("express");
const router = express.Router();
const orderRoutes = require("../controllers/orders");
const auth = require("../middlewares/auth");
const { verifyOrderStatus } = require("../controllers/verify");

router.get("/all", auth, orderRoutes.getAll);
router.get("/:id/info", orderRoutes.orderInfo);
router.post("/create", orderRoutes.createOrder);
router.delete("/delete", auth, orderRoutes.delete);
router.post("/deleteSingle/:id", auth, orderRoutes.deleteSingleOrder);
router.post("/verify", verifyOrderStatus);

module.exports = router;
