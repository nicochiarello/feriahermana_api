const express = require('express')
const router = express.Router()
const productsRoutes = require('../controllers/products')
const {upload} = require('../middlewares/upload')


router.get("/products", productsRoutes.getAll)
router.post("/product/create",upload.single('img') ,productsRoutes.create)
router.put("/product/update/:_id",upload.single('img') , productsRoutes.update);
router.get("/singleproduct/:id", productsRoutes.getSingleProduct)
router.delete("/product/delete/:id", productsRoutes.delete)

module.exports = router