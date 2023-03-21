const express = require("express");
const router = express.Router();
const {
  createWithdrawal,
  getWithdrawals,
  updateWithdrawal,
  deleteWithdrawal,
} = require("../controllers/withdrawals");
const auth = require("../middlewares/auth");

router.get("/", getWithdrawals);
router.post("/create", auth, createWithdrawal);
router.put("/update/:id", auth, updateWithdrawal);
router.delete("/delete/:id", auth, deleteWithdrawal);

module.exports = router;
