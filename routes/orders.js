const express = require('express')
const router = express.Router()
const orderRoutes = require('../controllers/orders')

router.get("/getall", orderRoutes.getAll)
router.post("/create", orderRoutes.createOrder)
router.post("/verify", (req,res)=>{
    try {
        res.status(200).json(req,res)
    } catch (error) {
        res.status(400).json(error)
    }
})


module.exports = router