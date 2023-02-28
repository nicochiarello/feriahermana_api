const express = require("express");
const router = express.Router();
const productsRoutes = require("../controllers/products");
const {create, update,getSingleProduct, getAll, deleteProduct, deleteAll } = require("../controllers/products")
const { upload } = require("../middlewares/upload");
const auth = require("../middlewares/auth");

// Get products route
router.get("/products", getAll);

// Create products route
router.post(
  "/product/create",
  // auth,
  upload.array("images", 5),
  create
);

// Update Products route
router.put(
  "/product/update/:id",
  upload.array("images"),
  update
);

// Single product info route
router.get("/product/:id", getSingleProduct);

// Delete product route
router.delete("/product/delete/:id",  deleteProduct);

//Delete all 
router.delete("/product/deleteall", deleteAll)

module.exports = router;
