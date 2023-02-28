const express = require("express");
const router = express.Router();
const {createUser, login, getAll, getSingle, updateUser, deleteAll} = require("../controllers/users");
const { body } = require("express-validator");
const userAuth = require('../middlewares/authUser')

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Debe ingresar un email valido")
      ,
      body('password').trim().isLength({min:5}).withMessage('La contraseña debe contener un mínimo de 5 caracteres'),
      body("name").trim().not().isEmpty().withMessage('El campo nombre no puede estar vacío')
  ],
  createUser
);

router.post("/login", login)

router.get("/all", getAll)

router.get("/getSingle/:id", getSingle)

router.delete("/delete", deleteAll)

router.post("/update/:id",userAuth, updateUser)

module.exports = router;
