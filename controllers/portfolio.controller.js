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
  // tls: {
  //   rejectUnauthorized: process.env.NODE_ENV === "production",
  // },
});

const getUserEmailContent = (name, email, comment, language) => {
  if (language === "fr") {
    return {
      subject: "Merci de m'avoir contacté!",
      html: `
        <p>Bonjour ${name},</p>

<p>Je vous remercie d'avoir pris contact via mon site portfolio ! J'ai bien reçu votre message et je vous répondrai dans les 24 à 48 heures.</p>

<p>Pour référence, voici un récapitulatif de votre message :</p>

<ul>
  <li>Nom : ${name}</li>
  <li>Email : ${email}</li>
  <li>Message : ${comment}</li>
</ul>

<p>En attendant ma réponse, je vous invite à découvrir mon travail :</p>
<ul style="list-style: none; padding: 0;">
  <li style="margin-bottom: 8px;">
    <a href="https://github.com/thomastepi" target="_blank" style="text-decoration: underline; color: #0077b5;">
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style="width: 20px; height: 20px; vertical-align: middle;"/> GitHub
    </a>
  </li>
  <li style="margin-bottom: 8px;">
    <a href="https://linkedin.com/in/thomastepi" target="_blank" style="text-decoration: underline; color: #0077b5;">
      <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 20px; height: 20px; vertical-align: middle;"/> LinkedIn
    </a>
  </li>
  <li>
    <a href="https://twitter.com/TomTepi" target="_blank" style="text-decoration: underline; color: #0077b5;">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px; vertical-align: middle;"/> Twitter
    </a>
  </li>
</ul>

<p>Cordialement,</p>

<p style="margin-bottom: 0;">--<br>Thomas Tepi</p>
<p style="margin-top: 5px; color: #666; font-size: 14px;">Développeur Full Stack</p>
<p style="margin-top: 5px;"><a href="https://thomastepi.com" style="color: #0366d6; text-decoration: none;">www.thomastepi.com</a></p>
      `,
    };
  } else {
    return {
      subject: "Thanks for contacting me!",
      html: `
        <p>Hi ${name},</p>

<p>Thank you for reaching out through my portfolio website! I've received your message and will respond within 24-48 hours.</p>

<p>For your reference, here's what you shared:</p>

<ul>
  <li>Name: ${name}</li>
  <li>Email: ${email}</li>
  <li>Message: ${comment}</li>
</ul>

<p>While you wait for my response, feel free to explore my work:</p>
<ul style="list-style: none; padding: 0;">
  <li style="margin-bottom: 8px;">
    <a href="https://github.com/thomastepi" target="_blank" style="text-decoration: underline; color: #0077b5;">
      <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" style="width: 20px; height: 20px; vertical-align: middle;"/> GitHub
    </a>
  </li>
  <li style="margin-bottom: 8px;">
    <a href="https://linkedin.com/in/thomastepi" target="_blank" style="text-decoration: underline; color: #0077b5;">
      <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 20px; height: 20px; vertical-align: middle;"/> LinkedIn
    </a>
  </li>
  <li>
    <a href="https://twitter.com/TomTepi" target="_blank" style="text-decoration: underline; color: #0077b5;">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 20px; height: 20px; vertical-align: middle;"/> Twitter
    </a>
  </li>
</ul>

<p>Best regards,</p>

<p style="margin-bottom: 0;">--<br>Thomas Tepi</p>
<p style="margin-top: 5px; color: #666; font-size: 14px;">Full Stack Developer</p>
<p style="margin-top: 5px;"><a href="https://thomastepi.com" style="color: #0366d6; text-decoration: none;">www.thomastepi.com</a></p>
      `,
    };
  }
};

const addMessage = async (req, res) => {
  const { name, email, type, comment, language } = req.body;
  const newMessage = new PortfolioModel({ name, email, type, comment });

  try {
    await newMessage.save();
    res.status(200).send("Message added successfully");

    const AdminMailOptions = {
      from: {
        name: "Portfolio Contact Form",
        address: process.env.EMAIL,
      },
      to: process.env.ADMIN_EMAIL,
      subject: "New Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nType: ${type}\nComment: ${comment}`,
    };

    const { subject, html } = getUserEmailContent(
      name,
      email,
      comment,
      language
    );
    const UserMailOptions = {
      from: {
        name: "Portfolio Contact Form",
        address: process.env.EMAIL,
      },
      to: email,
      subject,
      html,
    };

    transporter.sendMail(AdminMailOptions);
    transporter.sendMail(UserMailOptions);
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  }
};

module.exports = addMessage;
