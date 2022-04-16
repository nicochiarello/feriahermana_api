const Roles = require("../models/roles");

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
