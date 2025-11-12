const crypto = require("crypto");
require("dotenv").config();

function ensureGuestId(req, res, next) {
  if (!req.user || req.user?.role === "guest") {
    let gid = req.signedCookies.gid;
    if (!gid) {
      gid = crypto.randomUUID();
      res.cookie("gid", gid, {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30, // valid for 30 days
      });
    }
    req.guestId = gid;
  }
  next();
}

module.exports = ensureGuestId;
