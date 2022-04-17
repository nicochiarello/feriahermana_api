const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Roles = require("../models/roles");

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(errors);
  } else {

    const roles = req.body.roles;
    try {
      const user = {
        name: req.body.name,
        email: req.body.email,
      };
      if (roles) {
        const foundRoles = await Roles.findOne({ name: { $in: roles } });
        user.roles = foundRoles._id;
      } else {
        const role = await Roles.findOne({ name: "user" });
        user.roles = [role._id];
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 12);
      user.password = hashedPassword;
      const create = await new User(user);
      await create.save();
      const token = await jwt.sign(
        { email: create.email, userId: create._id.toString(), userRoles: user.roles },
        "feriahermanaAPI2425",
        { expiresIn: "1h" }
      );
      res.status(200).json({ msg: "user created", user: create, token, roles:user.roles });
    } catch (error) {
      res.status(400).json({ msg: error });
    }
  }
};

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userExists = await User.findOne({ email: email }).populate("orders").populate("roles");

  if (userExists) {
    const compare = await bcrypt.compare(password, userExists.password);
    if (compare) {
      const token = await jwt.sign(
        {
          email: userExists.email,
          userId: userExists._id.toString(),
          roles: userExists.roles,
        },
        "feriahermanaAPI2425",
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({
          msg: "user authenticated",
          token,
          cart: userExists.cart,
          orders: userExists.orders,
          _id: userExists._id,
          role: userExists.roles 
        });
    } else {
      res.status(400).json({ msg: "wrong password" });
    }
  } else {
    res.status(400).json({ msg: "email doesn´t exist" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.find({}).populate("orders");
    res.status(200).json({ users, nbhits: users.length });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const deleteAll = await User.deleteMany({});
    res.status(200).json("all users were deleted");
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getSingle = async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    res.status(200).json({ user: getUser });
  } catch (error) {
    res.status(404).json({ error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      direction: req.body.direction,
      mobile: req.body.mobile,
      zip: req.body.zip,
      dni: req.body.dni,
    };

    const update = await User.findByIdAndUpdate(req.params.id, updateData);

    res.status(200).json({ msg: "user updated", update });
  } catch (error) {
    res.status(500).json({ error });
  }
};
