const express = require('express')
const router = express.Router()
const orderRoutes = require('../controllers/orders')

router.get("/getall", orderRoutes.getAll)
router.post("/create", orderRoutes.createOrder)
router.post("/verify", orderRoutes.verify)


module.exports = router