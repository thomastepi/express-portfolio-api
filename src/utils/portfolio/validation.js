const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");
const validationMessages = require("../../locales/portfolio/validationMessages");

const validateMessage = (data) => {
  const language =
    data.language && validationMessages[data.language] ? data.language : "en";
  const messages = validationMessages[language];

  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
      "string.empty": messages["string.empty"],
      "string.min": messages["string.min"],
      "string.max": messages["string.max"],
      "any.required": messages["any.required"],
    }),
    email: Joi.string().email().required().messages({
      "string.empty": messages["string.empty"],
      "string.email": messages["string.email"],
      "any.required": messages["any.required"],
    }),
    type: Joi.string().trim().allow("").max(100),
    comment: Joi.string().trim().min(25).max(1000).required().messages({
      "string.empty": messages["string.empty"],
      "string.min": messages["string.min"],
      "string.max": messages["string.max"],
      "any.required": messages["any.required"],
    }),
    language: Joi.string().valid("en", "fr").default("en"),
  });

  const validationResult = schema.validate(data, { abortEarly: false });

  if (validationResult.error) {
    const formattedErrors = {};
    validationResult.error.details.forEach((err) => {
      const field = err.path[0];
      formattedErrors[field] = err.message;
    });

    return { error: formattedErrors };
  }

  return validationResult;
};

const sanitizeInput = (input) => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

module.exports = { validateMessage, sanitizeInput };
