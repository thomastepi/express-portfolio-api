const PortfolioModel = require("../models/portfolio.model");
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  port: 587,
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const addMessage = async (req, res) => {
  const { name, email, type, comment } = req.body;
  const newMessage = new PortfolioModel({ name, email, type, comment });
  newMessage
    .save()
    .then(() => {
      res.status(200).send("Message added successfully");
    })
    .catch((err) => {
      console.error("Error: ", err);
      res.status(500).send("Internal server error");
    });

  const mailOptions = {
    from: {
      name: "Portfolio Contact Form",
      address: process.env.EMAIL,
    },
    to: process.env.ADMIN_EMAIL,
    subject: "New Form Submission,",
    text: `Name: ${name}\nEmail: ${email}\nType: ${type}\nComment: ${comment}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error: ", err.message);
    } 
  });
};

module.exports = addMessage;
