const express = require('express')
const router = express.Router()
const productsRoutes = require('../controllers/products')
const {upload} = require('../middlewares/upload')
const auth = require('../middlewares/auth')


router.get("/products", productsRoutes.getAll)
router.post("/product/create",auth, upload.array('img',5) ,productsRoutes.create)
router.put("/product/update/:_id",auth,upload.array('img') , productsRoutes.update);
router.get("/singleproduct/:id", productsRoutes.getSingleProduct)
router.delete("/product/delete/:id",auth, productsRoutes.delete)

module.exports = router