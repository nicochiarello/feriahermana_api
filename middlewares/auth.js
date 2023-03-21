const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Roles = require("../models/roles");
module.exports = async (req, res, next) => {
  const token = req.get("token");

  try {
    let decodedtoken = await jwt.verify(token, process.env.SECRET);

    if (decodedtoken) {
      let user = await User.findById(decodedtoken.userId);
      let getRole = await Roles.findById(user.roles);

      if (getRole.name === "admin") {
        req.userId = decodedtoken.userId;
        req.roles = decodedtoken.roles;
        next();
      } else {
        res.status(401).json({ message: "Unahutorized" });
      }
    } else {
      res.status(401).json({ message: "incorrect token" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
