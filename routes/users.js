const express = require("express");
const router = express.Router();
const {
  createUser,
  login,
  getAll,
  getSingle,
  deleteAll,
} = require("../controllers/users");
const { body } = require("express-validator");
const auth = require("../middlewares/auth");

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Debe ingresar un email valido"),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("La contraseña debe contener un mínimo de 5 caracteres"),
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("El campo nombre no puede estar vacío"),
  ],
  createUser
);

router.post("/login", login);

router.get("/all", auth, getAll);

router.get("/getSingle/:id", auth, getSingle);

router.delete("/delete", auth, deleteAll);


module.exports = router;
