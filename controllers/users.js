const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors);
  }
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
    
    };
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    user.password = hashedPassword;
    const create = await new User(user);
    await create.save();
    const token = await jwt.sign({email: create.email, userId: create._id.toString()}, "feriahermanaAPI2425", {expiresIn: "1h"})
    res.status(200).json({ msg: "user created", user: create, token });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};

exports.login = async (req,res) => {
  const email = req.body.email
  const password = req.body.password
  const userExists = await User.findOne({email: email})
  await userExists.populate("orders")
  if(userExists){
    const compare = await bcrypt.compare(password, userExists.password)
    if(compare){
      const token = await jwt.sign(
        { email: userExists.email, userId: userExists._id.toString() },
        "feriahermanaAPI2425",
        { expiresIn: "1h" }
      );
      res.status(200).json({msg: "user authenticated", token, cart: userExists.cart, orders: userExists.orders, _id:userExists._id})
    }else{
      res.status(400).json({msg: 'wrong password'})
    }
  }else{
    res.status(400).json({msg: 'email doesn´t exist'})
  }


}


exports.getAll = async (req,res) => {
  try {
    const users = await User.find({}).populate("orders")
    res.status(200).json({users, nbhits: users.length})
  } catch (error) {
    res.status(500).json({error})
  }
}