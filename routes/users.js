const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/users");
const { body } = require("express-validator");
const User = require("../models/user");
const userAuth = require('../middlewares/authUser')

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Debe ingresar un email valido")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("El email ya existe");
          }
        });
      })
      .normalizeEmail(),
      body('password').trim().isLength({min:5}).withMessage('La contraseña debe contener un mínimo de 5 caracteres'),
      body("name").trim().not().isEmpty().withMessage('El campo nombre no puede estar vacío')
  ],
  userControllers.createUser
);

router.post("/login", userControllers.login)

router.get("/getall", userControllers.getAll)

router.get("/getSingle/:id", userControllers.getSingle)

// router.delete("/delete", userControllers.deleteAll)

router.post("/update/:id",userAuth, userControllers.updateUser)

module.exports = router;
