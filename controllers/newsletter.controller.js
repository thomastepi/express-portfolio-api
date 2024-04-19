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

const sendEmail = async (req, res) => {
  try {
    const { email, firstName, lastName, company } = req.body;

    const userMailOptions = {
      from: {
        name: "Sawyer Camp Farmers CIG",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "Welcome to our newsletter",
      text: `Hello ${firstName}, thank you for subscribing to our newsletter!`,
    };

    const adminMailOptions = {
      from: {
        name: "Sawyer Camp Farmers CIG",
        address: process.env.EMAIL,
      },
      to: process.env.ADMIN_EMAIL,
      subject: "New Newsletter Subscriber",
      text: `New subscriber details:\nEmail: ${email}\nFirst Name: ${firstName}\nLast Name: ${lastName}\nCompany: ${company}`,
    };

    transporter.sendMail(userMailOptions);
    transporter.sendMail(adminMailOptions);

    res.status(200).json({
      message: `Thank you for subscribing to our newsletter ${
        firstName || ""
      }! We will send you updates soon.`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = sendEmail;
