const HTTP_ERRORS = {
  INTERNAL_SERVER_ERROR: {
    status: 500,
    error: "Internal server error",
    message: () => "Something went wrong on our side. Please try again.",
  },
  USER_NOT_FOUND: {
    status: 404,
    error: "User not found",
    message: ({ by = "username" } = {}) =>
      by === "email"
        ? "We couldn’t find an account with that email."
        : "We couldn’t find an account with that username.",
  },
  INVALID_CREDENTIALS: {
    status: 401,
    error: "Invalid credentials",
    message: () => "The password you entered is incorrect.",
  },
  USER_ALREADY_EXISTS: {
    status: 400,
    error: "User already exists",
    message: () => "That username is already taken. Try another one.",
  },
  EMAIL_NOT_VERIFIED: {
    status: 400,
    error: "Email not verified",
    message: () =>
      "Your Google account email isn’t verified. Please verify it and try again.",
  },
  GOOGLE_OAUTH_FAILED: {
    status: 401,
    error: "Google OAuth failed",
    message: () => "We couldn’t sign you in with Google. Please try again.",
  },
  UPDATE_FAILED: {
    status: 400,
    error: "Update failed",
    message: () =>
      "We couldn’t update your profile. Check your inputs and try again.",
  },
  EMAIL_IN_USE: {
    status: 400,
    error: "Email already in use",
    message: () => "That email is already linked to another account.",
  },
  EMAIL_NOT_FOUND: {
    status: 400,
    error: "Email not found",
    message: () => "No account is associated with this email.",
  },
  EMAIL_UPDATE_FAILED: {
    status: 400,
    error: "Email update failed",
    message: () =>
      "We couldn’t update your email. Check your inputs and try again.",
  },
  GOOGLE_SIGN_IN: {
    status: 400,
    error: "Google Sign-In account",
    message: () =>
      "This account uses Google sign-in. Please log in with Google.",
  },
  INVALID_OR_EXPIRED_TOKEN: {
    status: 400,
    error: "Invalid or expired token",
    message: () =>
      "Your reset link is invalid or expired. Please request a new one.",
  },
  AI_SERVICE_UNAVAILABLE: {
    status: 503,
    error: "Service unavailable",
    message: () =>
      "The AI builder is temporarily unavailable. Please try again later.",
  },
  RATE_LIMITED: {
    status: 429,
    error: "AI Not Available",
    message: () =>
      "Our AI generation system is currently out of credits. The admin is refreshing our quota. Please try again later.",
  },
};

module.exports = HTTP_ERRORS;
