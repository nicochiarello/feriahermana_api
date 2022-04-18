const { json } = require("express");
const Products = require("../models/product");
const Roles = require("../models/roles");
const aws = require('aws-sdk')


const s3 = new aws.S3({
  accessKeyId: "AKIA6HK2ZBTX6HAF54SA",
  secretAccessKey: "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",
  ACL: "public-read",
});

exports.getAll = async (req, res) => {
  let { category, sort, name, sale, view } = req.query;
  let find = {};
  if (category) {
    find.category = category;
  }
  if (sale === "true") {
    find.sale = true;
  }
  if (name) {
    find.name = { $regex: name, $options: "i" };
  }

  if (!sort) {
    sort = "-createdAt";
  }

  if (view) {
    find.view = view;
  }

  const currentPage = req.query.page || 1;
  const perPage = req.query.items;
  const totalItems = await Products.find(find).countDocuments();
  try {
    const fetchedProducts = await Products.find(find)
      .collation({ locale: "en" })
      .sort(sort)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      products: fetchedProducts,
      nbHits: fetchedProducts.length,
      totalItems: totalItems,
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.getSingleProduct = async (req, res) => {
  try {
    const singleProduct = await Products.findById(req.params.id);
    res.status(200).json({ product: singleProduct });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.create = async (req, res) => {
  try {
    const product = new Products({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      img: req.file.location,
      size: req.body.size,
      view: req.body.view,
    });
    if (req.body.sale) {
      product.sale = req.body.sale;
    }
    if (req.body.discount) {
      product.discount = req.body.discount;
    }
    await product.save();
    res.status(200).json({ productCreated: product });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.update = async (req, res) => {
  try {
    const edit = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      size: req.body.size,
      view: req.body.view,
    };
    if (req.file) {
      edit.img = req.file.location;
    }
    if (req.body.sale) {
      edit.sale = req.body.sale;
    }
    if (req.body.discount) {
      edit.discount = req.body.discount;
    }
    const updatedProduct = await Products.findByIdAndUpdate(
      req.params._id,
      edit
    );
    res.status(202).json({ status: "ok", productUpdated: updatedProduct });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleteProducts = await Products.findById(req.params.id);
    s3.deleteObject(
      { Bucket: "feria-hermana", Key: "1650311032635226312-500-auto.webp" },
      (err, data) => {
        console.error(err);
        console.log(data);
        console.log(deleteProducts.img.slice(39));
      }
    );
    await deleteProducts.delete()
    res
      .status(200)
      .json({ msg: `product ${req.params.id} deleted succesfully` });
  } catch (error) {
    json.status(404).json({ msg: "failed to delete" });
  }
};
