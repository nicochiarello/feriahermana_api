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
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
      body('password').trim().isLength({min:5}).withMessage('password must contain a minimun of 5 characters'),
      body("name").trim().not().isEmpty().withMessage('the field name can´t be empty')
  ],
  userControllers.createUser
);

router.post("/login", userControllers.login)

router.get("/getall", userControllers.getAll)

router.get("/getSingle/:id", userControllers.getSingle)

// router.delete("/delete", userControllers.deleteAll)

router.post("/update/:id",userAuth, userControllers.updateUser)

module.exports = router;
