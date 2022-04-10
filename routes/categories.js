const categoriesController = require('../controllers/categories')
const express = require('express')
const router = express.Router()


router.post("/create", categoriesController.createCategory)
router.delete("/delete/:_id", categoriesController.deleteCategory)
router.get("/fetch", categoriesController.getAllCategories)
module.exports = router