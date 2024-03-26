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
    const { email, name, comment } = req.body;

    const userMailOptions = {
      from: {
        name: "Sawyer Camp Farmers CIG",
        address: process.env.EMAIL,
      },
      to: email,
      subject: "Thank you for contacting us",
      text: `Hello ${name}, thank you for contacting us! We will get back to you soon.`,
    };

    const adminMailOptions = {
      from: {
        name: "Sawyer Camp Farmers CIG",
        address: process.env.EMAIL,
      },
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Us Submission",
      text: `New submission details:\nEmail: ${email}\nName: ${name}\nComment: ${comment}`,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: `Thank you for contacting us ${name}! We will get back to you soon.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = sendEmail;
