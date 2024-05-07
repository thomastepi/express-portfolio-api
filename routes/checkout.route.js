const express = require("express");
const router = express.Router();
const { createPaymentIntent } = require("../controllers/checkout.controller");

router.post("/create-checkout-session", createPaymentIntent);

module.exports = router;
