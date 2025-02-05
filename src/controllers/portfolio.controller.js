const PortfolioModel = require("../models/portfolio.model");
const {
  validateMessage,
  sanitizeInput,
} = require("../utils/portfolio/validation");
const {
  getUserEmailContent,
  getAdminEmailContent,
} = require("../templates/portfolio/emailTemplates");
const transporter = require("../config/nodemailer");

const addMessage = async (req, res) => {
  try {
    const validationResult = validateMessage(req.body);

    if (validationResult.error) {
      return res.status(400).json(validationResult.error);
    }

    const sanitizedData = {
      name: sanitizeInput(req.body.name),
      email: sanitizeInput(req.body.email),
      type: sanitizeInput(req.body.type) || "",
      comment: sanitizeInput(req.body.comment),
      language: req.body.language || "en",
    };

    const newMessage = new PortfolioModel(sanitizedData);
    await newMessage.save();

    res.status(200).send("Message added successfully");

    const { subject: userSubject, html: userHtml } = getUserEmailContent(
      sanitizedData.name,
      sanitizedData.email,
      sanitizedData.comment,
      sanitizedData.language
    );

    const adminEmailContent = getAdminEmailContent(sanitizedData);

    await transporter.sendMail(adminEmailContent);
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL}>`,
      to: sanitizedData.email,
      subject: userSubject,
      html: userHtml,
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  }
};

module.exports = addMessage;
