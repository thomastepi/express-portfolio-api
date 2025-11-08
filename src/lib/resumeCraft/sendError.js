const HTTP_ERRORS = require("../../utils/resumeCraft/htttpErrors");

function sendError(res, code, ctx = {}) {
  const def = HTTP_ERRORS[code];
  if (!def) {
    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      error: "Internal server error",
      message: "Something went wrong on our side. Please try again.",
    });
  }
  const message =
    typeof def.message === "function" ? def.message(ctx) : def.message;
  return res
    .status(ctx.status ?? def.status)
    .json({ code, error: def.error, message });
}

module.exports = sendError;
