const express = require("express");
const router = express.Router();
const orderRoutes = require("../controllers/orders");
const auth = require("../middlewares/auth");
const authUser = require("../middlewares/authUser");
const {verifyOrderStatus} = require("../controllers/verify")

router.get("/all", orderRoutes.getAll);
router.get("/:id/info", orderRoutes.orderInfo)
router.post("/create", orderRoutes.createOrder);
// router.post("/verify", orderRoutes.verify)
router.delete("/delete", orderRoutes.delete);
router.post("/deleteSingle/:id", auth, orderRoutes.deleteSingleOrder);
router.post("/verify", verifyOrderStatus)

module.exports = router;
