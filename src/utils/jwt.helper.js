const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
