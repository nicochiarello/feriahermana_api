const categoriesController = require('../controllers/categories')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')


router.post("/create",auth, categoriesController.createCategory)
router.delete("/delete/:_id",auth, categoriesController.deleteCategory)
router.get("/fetch", categoriesController.getAllCategories)
module.exports = router