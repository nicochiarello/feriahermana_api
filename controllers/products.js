const { json } = require("express");
const Products = require("../models/product");
const Roles = require("../models/roles");
const { s3 } = require("../middlewares/upload");
const cloudinary = require("../utils/cloudinary");
const { ChimeSDKMessaging } = require("aws-sdk");

exports.getAll = async (req, res) => {
  let { sort } = req.query;

  let find = {};

  for (query of Object.entries(req.query)) {
    if (query[0] === "name") {
      find[query[0]] = { $regex: query[1], $options: "i" };
    } else {
      find[query[0]] = query[1];
    }
  }

  if (!sort) {
    sort = "-createdAt";
  }

  const currentPage = req.query.page || 1;
  const perPage = req.query.items || 25;
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
      nbPages: Math.ceil(totalItems / perPage),
      totalItems: totalItems,
      currentPage,
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
    console.log(req.body);
    const path = {};
    const uploadImg = async () => {
      let iterator = 0;
      for (const file of req.files) {
        path[iterator] = { secureUrl: file.location, publicId: file.key };
        iterator++;
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
    res.status(400).json(error.errors);
  }
};

exports.update = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(req.files)
    let updatedImages;

    if (req.body.updatedImages) {
      updatedImages = JSON.parse(req.body.updatedImages[1]);
    }

    let product = await Products.findById(id);
    console.log(product)
    console.log(req.body)

    let updateImages = () => {
      let aux = { ...product.images };
      if (!updatedImages) {
        return aux;
      }
      for (let updatedImage of Object.entries(updatedImages)) {
        for (let multerImage of req.files) {
          if (multerImage.originalname.split(".")[0] === updatedImage[1].split(".")[0]) {
            
            aux[updatedImage[0]] = { secureUrl: multerImage.location, publicId: multerImage.key };
          }
        }
      }
      return { ...aux };
    };

    product.images = updateImages();

    for (let item of Object.entries(req.body)) {
      product[item[0]] = item[1];
    }

    // product.name = name
    // product.price = price
    // product.description = description
    // product.category = category
    // product.size = size

    await product.save();

    return res.status(201).json({ msg: "Updated" });
  } catch (error) {
    console.log(error);
  }
  // try {
  //   const product = await Products.findById(req.params._id);
  //   const prevImages = JSON.parse(req.body.prevImages);

  //   console.log(prevImages)

  //   const uploadImages = async () => {
  //     let iterator = 0;
  //     let i = 0;
  //     let aux = [];
  //     for (let img of oldImages) {
  //       if (img.secureUrl) {
  //         aux.push(img);
  //       } else {
  //         aux.push({
  //           secureUrl: req.files[iterator].location,
  //           publicId: req.files[iterator].key,
  //         });

  //         iterator = iterator + 1;
  //       }
  //     }
  //     return (product.images = aux);
  //   };

  //   product.name = req.body.name;
  //   product.price = req.body.price;
  //   product.category = req.body.category;
  //   product.size = req.body.size;
  //   product.view = req.body.view;
  //   product.description = req.body.description;
  //   // if (req.files) {
  //   //   await uploadImages();
  //   // }

  //   if (req.body.sale) {
  //     product.sale = req.body.sale;
  //   }
  //   if (req.body.discount) {
  //     product.discount = req.body.discount;
  //   }
  //   const saveProduct = await product.save();
  //   res.status(202).json({ status: "ok", productUpdated: saveProduct });
  // } catch (error) {
  //   console.log(error);
  //   res.status(400).json(error);
  // }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    // if (product.images) {
    //   for (let img of product.images) {
    //     await s3.deleteObject(
    //       { Bucket: "feria-hermana", key: img.publicId },
    //       (err, data) => {
    //         if (err) {
    //           console.log(err);
    //         }
    //         console.log(data);
    //       }
    //     );
    //     // cloudinary.v2.uploader.destroy(img.publicId, function (error, result) {
    //     //   console.log(result, error);
    //     // });
    //   }
    // }

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
