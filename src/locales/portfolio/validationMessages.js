const validationMessages = {
  en: {
    "string.empty": "This field cannot be empty.",
    "string.min": "This field must be at least {#limit} characters long.",
    "string.max": "This field must not exceed {#limit} characters.",
    "string.email": "Invalid email format.",
    "any.required": "This field is required.",
  },
  fr: {
    "string.empty": "Ce champ ne peut pas être vide.",
    "string.min": "Ce champ doit contenir au moins {#limit} caractères.",
    "string.max": "Ce champ ne doit pas dépasser {#limit} caractères.",
    "string.email": "Format d'e-mail invalide.",
    "any.required": "Ce champ est obligatoire.",
  },
};

module.exports = validationMessages;
