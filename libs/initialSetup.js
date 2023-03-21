const Roles = require("../models/roles");
const Users = require("../models/user")
const bcrypt = require("bcrypt")

exports.createRoles = async () => {
  try {
    const count = await Roles.estimatedDocumentCount();
    if (count > 0) {
      return;
    }
    const values = await Promise.all([
      new Roles({ name: "user" }).save(),
      new Roles({ name: "admin" }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};

exports.createUser = async () => {
  try {
    const count = await Users.estimatedDocumentCount();
    if (count > 0) {
      return;
    }
    const adminRole = await Roles.findOne({name: "admin"})
    const user = await new Users({
      name: "Feria Hermana",
      email: "admin@feriahermana.com", 
      password: process.env.FH_ADMIN_USER_PASSWORD,
      roles: [adminRole._id]
    })
    const hashedPassword = await bcrypt.hash("feriahermana", 12);
    user.password = hashedPassword
    user.save()
  } catch (error) {
    console.log(error)
  }
}
