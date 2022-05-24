const { json } = require("express");
const Products = require("../models/product");
const Roles = require("../models/roles");

const cloudinary = require("../utils/cloudinary");

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
      size: req.body.size,
      view: req.body.view,
    });
    const path = [];
    const uploadImg = async () => {
      for (const file of req.files) {
        let url = await cloudinary.v2.uploader.upload(file.path);
        path.push({ secureUrl: url.secure_url, publicId: url.public_id });
        console.log(path);
      }
    };

    await uploadImg();
    product.images = path;

    if (req.body.sale) {
      product.sale = req.body.sale;
    }
    if (req.body.discount) {
      product.discount = req.body.discount;
    }
    if (req.body.description) {
      product.description = req.body.description;
    }
    await product.save();
    res.status(200).json({ productCreated: product });
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.update = async (req, res) => {
  try {
    console.log({ files: req.files });
    console.log({body: req.body})
    const product = await Products.findById(req.params._id);
    const oldImages = JSON.parse(req.body.oldImages);


    const uploadImages = async () => {
      let iterator = 0;
      let i = 0
      let aux = [];
      for (let img of oldImages) {
        if (img.secureUrl) {
          aux.push(img);
       
        } else {
          
          let url = await cloudinary.v2.uploader.upload(
            req.files[iterator].path
          );
          aux.push({
            secureUrl: url.secure_url,
            publicId: url.public_id,
          });
        
          iterator = iterator + 1;
        }
      }
      return (product.images = aux);
    };

    product.name = req.body.name;
    product.price = req.body.price;
    product.category = req.body.category;
    product.size = req.body.size;
    product.view = req.body.view;
    product.description = req.body.description;
    if (req.files) {
      await uploadImages();
    }

    if (req.body.sale) {
      product.sale = req.body.sale;
    }
    if (req.body.discount) {
      product.discount = req.body.discount;
    }
    const saveProduct = await product.save();
    res.status(202).json({ status: "ok", productUpdated: saveProduct });
  } catch (error) {
    console.log(error)
    res.status(400).json(error);
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    for (let img of product.images) {
      cloudinary.v2.uploader.destroy(img.publicId, function (error, result) {
        console.log(result, error);
      });
    }

    await product.delete();
    res
      .status(200)
      .json({ msg: `product ${req.params.id} deleted succesfully` });
  } catch (error) {
    res.status(404).json({ msg: "failed to delete" });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deleteAll = await Products.deleteMany({});
    res.status(200).json("deleted");
  } catch (error) {
    res.status(400).json({ error });
  }
};
