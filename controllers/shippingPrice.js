const ShippingPrice = require('../models/shippingPrice')

exports.getPrice = async (req,res) => {
    const price = await ShippingPrice.find({})
    
    return res.status(200).json(price)
}