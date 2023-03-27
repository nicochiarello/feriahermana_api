const Products = require("../models/product");

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
  const perPage = req.query.items || 24;
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
    const path = {};
    const uploadImg = async () => {
      let iterator = 0;
      for (const file of req.files) {
        path[iterator] = { secureUrl: file.filename };
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
    let updatedImages;

    if (req.body.updatedImages) {
      updatedImages = JSON.parse(req.body.updatedImages[1]);
    }

    let product = await Products.findById(id);

    let updateImages = () => {
      let aux = { ...product.images };
      if (!updatedImages) {
        return aux;
      }
      for (let updatedImage of Object.entries(updatedImages)) {
        for (let multerImage of req.files) {
          if (
            multerImage.originalname.split(".")[0] ===
            updatedImage[1].split(".")[0]
          ) {
            aux[updatedImage[0]] = {
              secureUrl: multerImage.location,
              publicId: multerImage.key,
            };
          }
        }
      }
      return { ...aux };
    };

    product.images = updateImages();

    for (let item of Object.entries(req.body)) {
      product[item[0]] = item[1];
    }

    await product.save();

    return res.status(201).json({ msg: "Updated" });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

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
