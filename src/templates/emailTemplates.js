const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const loadTemplate = (templateName, replacements) => {
  const filePath = path.join(__dirname, `${templateName}.html`);
  const template = fs.readFileSync(filePath, "utf-8");
  const compiledTemplate = handlebars.compile(template);
  return compiledTemplate(replacements);
};

const getUserEmailContent = (name, email, comment, language) => {
  return {
    subject:
      language === "fr"
        ? "Merci de m'avoir contacté!"
        : "Thanks for contacting me!",
    html: loadTemplate(
      language === "fr" ? "portfolio/user_fr" : "portfolio/user_en",
      {
        name,
        email,
        comment,
      }
    ),
  };
};

const getAdminEmailContent = (data) => {
  return {
    from: `"Portfolio Contact" <${process.env.EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Form Submission",
    text: `Name: ${data.name}\nEmail: ${data.email}\nType: ${data.type}\nComment: ${data.comment}\nLanguage: ${data.language}`,
  };
};

const getResetpasswordContent = (email, name, resetLink) => {
  return {
    subject: "Reset your password",
    html: loadTemplate("resumeCraft/resetPassword", {
      email,
      name,
      resetLink,
    }),
  };
};

module.exports = {
  getUserEmailContent,
  getAdminEmailContent,
  getResetpasswordContent,
};
