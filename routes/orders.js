const express = require('express')
const router = express.Router()
const orderRoutes = require('../controllers/orders')
const auth = require('../middlewares/auth')
const authUser = require('../middlewares/authUser')

router.get("/getall", orderRoutes.getAll)
router.post("/create",authUser, orderRoutes.createOrder)
// router.post("/verify", orderRoutes.verify)
// router.delete("/delete",auth, orderRoutes.delete)
router.post("/deleteSingle/:id",auth, orderRoutes.deleteSingleOrder)

module.exports = router