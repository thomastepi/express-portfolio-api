const express = require("express");
const router = express.Router();
const { login, register, updateUser } = require("../../controllers/bookmart/bookUser.controller");
const authenticateToken = require('../../middleware/authenticateToken');


router.post("/register", register);
router.post("/login", login);
router.patch("/update", authenticateToken, updateUser);


module.exports = router;

