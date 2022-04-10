const Categories = require("../models/categories");

exports.createCategory = async (req, res) => {
  try {
    const create = await new Categories({
      name: req.body.name,
    });
    await create.save()
    res.status(200).json({msg: `category ${req.body.name} created`, category: create})
  } catch (error) {
      res.status(500).json(error)
  }
};


exports.deleteCategory = async (req,res) => {
    try {
        const deleteCategory = await Categories.findByIdAndRemove(req.params._id)
        res.status(200).json({msg: "category deleted", productDeleted: deleteCategory })
    } catch (error) {
        res.status(400).json({msg: error})
    }
}

exports.getAllCategories = async (req,res) => {
    try {
        const categories = await Categories.find({})
        res.status(200).json({categories})
    } catch (error) {
        res.status(400).json({err: error})
    }
}