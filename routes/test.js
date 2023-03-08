const express = require("express")
const sendEmail = require("../utils/sendEmail")
const router = express.Router()

router.get("/", sendEmail)

module.exports = router