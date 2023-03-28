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
    const user = {
      name: "Feria Hermana",
      email: "admin@feriahermana.com", 
      roles: [adminRole._id]
    }
    const hashedPassword = await bcrypt.hash(process.env.FH_ADMIN_USER_PASSWORD, 12);
    user.password = hashedPassword
    await new Users(user)
  } catch (error) {
    console.log(error)
  }
}
