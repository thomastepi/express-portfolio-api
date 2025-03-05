const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  let token = req.get("Authorization");
  if (!token) {
    return res.status(401).send("No token provided.");
  }
  token = token.replace("Bearer ", "");
  jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid Token");
    }
    if (
      decoded.role === "guest" &&
      ["POST", "PATCH", "DELETE"].includes(req.method)
    ) {
      return res.status(403).json({
        error: "Unauthorized Access!",
        message:
          "You're exploring as a Guest! While you can browse freely, creating, editing, and deleting content requires an account. Sign up for free to unlock all features!",
      });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
