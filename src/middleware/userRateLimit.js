const rateLimit = require("express-rate-limit");

// Shared 429 payload
const tooMany = (by = "user") => {
  return {
    error: "Too many resume generations.",
    message: `You've reached the limit of ${
      by === "user" ? "5" : "2"
    } resume generations per hour. Please wait until the limit resets before trying again. ${
      by === "guest"
        ? "Consider creating a free account for more generations."
        : ""
    }`,
    retryAfter: "1 hour",
    suggestion:
      "Consider refining your resume before regenerating to make the most of your limit.",
    remaining: 0,
  };
};

// Guests: 2/hour, keyed by IP (fallback to guestID)
const guestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 2,
  keyGenerator: (req) => req.ip || req.guestId,
  message: tooMany("guest"),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  identifier: "guest-1h",
});

// Auth users: 5/hour, keyed by user id
const userLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  keyGenerator: (req) => req.user.id,
  message: tooMany("user"),
  standardHeaders: "draft-8",
  legacyHeaders: false,
  identifier: "user-1h",
});

function pickLimiter(req, res, next) {
  const isGuest = !req.user || req.user.role === "guest";
  return (isGuest ? guestLimiter : userLimiter)(req, res, next);
}

module.exports = pickLimiter;
