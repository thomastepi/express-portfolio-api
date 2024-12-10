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

  const AdminMailOptions = {
    from: {
      name: "Portfolio Contact Form",
      address: process.env.EMAIL,
    },
    to: process.env.ADMIN_EMAIL,
    subject: "New Form Submission,",
    text: `Name: ${name}\nEmail: ${email}\nType: ${type}\nComment: ${comment}`,
  };

  const UserMailOptions = {
    from: {
      name: "Portfolio Contact Form",
      address: process.env.EMAIL,
    },
    to: email,
    subject: "Thanks for contacting me!",
    html: `
    <p>Hi ${name},</p>

        <p>Thanks for reaching out to me through my portfolio website! I received your message and will get back to you as soon as possible.</p>

        <p>In the meantime, here's a quick recap of your message:</p>

        <ul>
          <li>Your Name: ${name}</li>
          <li>Your Email: ${email}</li>
          <li>Your Message: ${comment}</li>
        </ul>

        <p>You can also connect with me on:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 8px;">
            <a href="https://twitter.com/TomTepi" target="_blank" style="text-decoration: none; color: inherit;">
              <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px; vertical-align: middle;"/> Twitter
            </a>
          </li>
          <li>
            <a href="https://linkedin.com/in/thomastepi" target="_blank" style="text-decoration: none; color: inherit;">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 20px; height: 20px; vertical-align: middle;"/> LinkedIn
            </a>
          </li>
        </ul>

        <p>Thanks again for your interest!</p>

        <p>Sincerely,</p>

        <p>Thomas Tepi.</p>`,
  };

  transporter.sendMail(AdminMailOptions, (err) => {
    if (err) {
      console.error("Error: ", err.message);
    }
  });

  transporter.sendMail(UserMailOptions, (err) => {
    if (err) {
      console.error("Error: ", err.message);
    }
  });
};

module.exports = addMessage;
