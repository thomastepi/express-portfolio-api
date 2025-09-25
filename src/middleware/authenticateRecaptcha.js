const verifyCaptcha = require("../utils/resumeCraft/verifyCaptcha");

const reCAPTCHAVerify = async (req, res, next) => {
  try {
    const { username, captchaToken } = req.body;

    if (username && username === "guest") {
      return next();
    }

    if (!captchaToken) {
      return res.status(400).json({
        error: "Missing reCAPTCHA token.",
        message: "Please complete the reCAPTCHA verification.",
      });
    }

    const captchaVerified = await verifyCaptcha(captchaToken);
    if (!captchaVerified) {
      return res.status(400).json({
        error: "reCAPTCHA verification failed.",
        message: "reCAPTCHA Failed: Please verify that you're not a robot.",
      });
    }

    next();
  } catch (error) {
    console.error("reCAPTCHA Middleware Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = reCAPTCHAVerify;
