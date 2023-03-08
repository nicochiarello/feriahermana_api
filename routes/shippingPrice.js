const shippingControllers = require('../controllers/shippingPrice')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')


// router.post("/create", categoriesController.createCategory)
router.get("/", shippingControllers.getPrice)

module.exports = router