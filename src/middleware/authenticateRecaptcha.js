const verifyCaptcha = require("../utils/resumeCraft/verifyCaptcha");

const reCAPTCHAVerify = async (req, res, next) => {
  const captchaToken = req.body.captchaToken;
  const captchaVerified = await verifyCaptcha(captchaToken);
  if (!captchaVerified) {
    return res.status(400).json({
      error: "reCAPTCHA verification failed.",
      message: "reCAPTCHA Failed: Please verify that you're not a robot.",
    });
  }
  next();
};

module.exports = reCAPTCHAVerify;
