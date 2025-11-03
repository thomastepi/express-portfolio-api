const Joi = require("joi");
const sanitizeHtml = require("sanitize-html");

const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+-={}\[\]:;"'<>,.?\/`~\\]+$/;
const usernameRegex = /^[a-zA-Z0-9_.-]+$/;

const validateUser = (data, isRegister = false) => {
  const schema = Joi.object({
    username: Joi.string()
      .trim()
      .min(3)
      .max(20)
      .pattern(usernameRegex)
      .required()
      .messages({
        "string.pattern.base":
          "Username can only contain letters, numbers, _, ., and -",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username must be at most 20 characters",
        "any.required": "Username is required",
      }),

    password: Joi.string()
      .trim()
      .min(6)
      .pattern(passwordRegex)
      .required()
      .messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
      }),

    cpassword: Joi.string()
      .valid(Joi.ref("password"))
      .when("$isRegister", {
        is: true,
        then: Joi.required().messages({
          "any.only": "Passwords must match",
          "any.required": "Please confirm your password",
        }),
      }),
  }).options({ abortEarly: false, stripUnknown: true });

  return schema.validate(data, { context: { isRegister } });
};

const updateUser = Joi.object({
  username: Joi.string().trim().required(),
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z][a-zA-Z\s'-]*$/)
    .required(),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z][a-zA-Z\s'-]*$/)
    .required(),
  mobileNumber: Joi.string()
    .trim()
    .pattern(/^\+?[0-9\s()-]{10,20}$/)
    .required(),
  email: Joi.string().trim().email().required(),
  portfolio: Joi.string().trim().uri().allow(null, ""),
  summary: Joi.string()
    .trim()
    .min(50)
    .max(1000)
    .pattern(/^[a-zA-Z0-9\s.,!?'"()\-_@#%&*+=[\]{}|:;<>/]+$/u),
  address: Joi.string()
    .trim()
    .min(10)
    .max(200)
    .pattern(/^[a-zA-Z0-9\s.,#&'’/()-]+$/),
  education: Joi.array().items(
    Joi.object({
      qualification: Joi.string().trim().min(2).max(100),
      institution: Joi.string().trim().min(2).max(100),
      range: Joi.string()
        .trim()
        .pattern(/^\d{4}(-(\d{4}|present))?$/),
    })
  ),
  skills: Joi.array().items(
    Joi.object({
      skill: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .pattern(/^[a-zA-Z0-9\s\-\+\#\.\,\/\(\)\']+$/),
    })
  ),
  projects: Joi.array().items(
    Joi.object({
      title: Joi.string().trim().min(2).max(100),
      description: Joi.string().trim().min(20).max(1000),
      range: Joi.string()
        .trim()
        .pattern(/^\d{4}(-(\d{4}|present))?$/),
    })
  ),
  experience: Joi.array().items(
    Joi.object({
      company: Joi.string().trim().min(2).max(100),
      role: Joi.string().trim().min(2).max(100),
      roleDescription: Joi.string().trim().min(20).max(1000),
      place: Joi.string().trim().min(2).max(100),
      range: Joi.string()
        .trim()
        .pattern(/^\d{4}(-(\d{4}|present))?$/),
    })
  ),
  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().trim().min(2).max(100),
      organization: Joi.string().trim().min(2).max(100),
      year: Joi.string()
        .trim()
        .pattern(/^\d{4}$/),
    })
  ),
  languages: Joi.array().items(
    Joi.object({
      language: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/),
      proficiency: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .pattern(/^[a-zA-Z\s]+$/),
    })
  ),
}).unknown(true);

const updateUserEmail = Joi.object({
  email: Joi.string().trim().email().required(),
}).unknown(true);

const sanitizeInput = (input) =>
  sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });

const validatePrompt = (prompt) => {
  if (!prompt || typeof prompt !== "string") {
    return { error: "Invalid input. Please provide valid resume details." };
  }
  let text = sanitizeInput(prompt).trim();
  if (text.length > 8000) {
    return { error: "Input too long. Please shorten your resume details." };
  }
  if (!/resume|cv|profile/i.test(text)) {
    return { error: "Invalid request content." };
  }
  return { text };
};

module.exports = {
  validateUser,
  updateUser,
  updateUserEmail,
  sanitizeInput,
  validatePrompt,
};
