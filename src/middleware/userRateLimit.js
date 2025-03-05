const rateLimit = require("express-rate-limit");

const userRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  keyGenerator: (req) => req.user?.id || req.ip,

  message: (req, res) => {
    return res.status(429).json({
      error: "Too many resume generations.",
      message:
        "You've reached the limit of 3 resume generations per hour. Please wait until the limit resets before trying again. Thanks for your patience!",
      retryAfter: "1 hour",
      suggestion:
        "Consider refining your resume before regenerating to make the most of your limit.",
      remaining: 0,
    });
  },

  standardHeaders: "draft-8",
  legacyHeaders: false,
});

module.exports = userRateLimit;
