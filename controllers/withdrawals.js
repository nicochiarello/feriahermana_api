const axios = require("axios");
const Withdrawals = require("../models/withdrawals");
const Witdrawals = require("../models/withdrawals");

exports.createWithdrawal = async (req, res) => {
  try {
    await Witdrawals.create(req.body);
    res.status(201).json({ oki: "doki" });
  } catch (error) {
    res.status(500).json(error.errors);
  }
};

exports.updateWithdrawal = async (req, res) => {
  try {
    let updated = await Witdrawals.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({ oki: "doki" });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getWithdrawals = async (req, res) => {
  try {
    let withdrawals = await Withdrawals.find({});
    res.status(200).json({ withdrawals });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteWithdrawal = async (req, res) => {
  try {
    await Withdrawals.findByIdAndRemove(req.params.id);
    res.status(200).json({ oki: "doki" });
  } catch (error) {
    res.status(500).json(error);
  }
};
