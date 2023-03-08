const categoriesController = require('../controllers/categories')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')


router.post("/create", categoriesController.createCategory)
router.delete("/delete/:_id", categoriesController.deleteCategory)
router.get("/", categoriesController.getAllCategories)
module.exports = router