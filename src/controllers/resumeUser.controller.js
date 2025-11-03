require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { UserModel, TokenModel } = require("../models/resumeUser.model");
const { generateToken } = require("../utils/jwt.helper");
const crypto = require("crypto");
const GuestSessionModel = require("../models/resumeGuestUser.model");
const runCompletion = require("../config/openai");
const {
  validateUser,
  updateUser,
  updateUserEmail,
  sanitizeInput,
  validatePrompt,
} = require("../utils/resumeCraft/validation");
const transporter = require("../config/nodemailer");
const { getResetpasswordContent } = require("../templates/emailTemplates");

const saltRounds = 10;

async function login(req, res) {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  username = sanitizeInput(req.body.username);
  password = sanitizeInput(req.body.password);

  const user = await UserModel.findOne({ username }).catch((err) => {
    console.error("Error: ", err);
    res.status(500).json({ message: "Internal server error" });
  });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const role = user.username === "guest" ? "guest" : "user";
      const accessToken = jwt.sign(
        { id: user._id.toString(), username: user.username, role: role },
        process.env.ACCESS_TOKEN,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        _id: user._id.toString(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        mobileNumber: user.mobileNumber,
        email: user.email,
        portfolio: user.portfolio,
        summary: user.summary,
        address: user.address,
        education: user.education,
        skills: user.skills,
        projects: user.projects,
        experience: user.experience,
        certifications: user.certifications,
        languages: user.languages,
        accessToken,
      });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  }
}

async function googleOAuth(req, res) {
  try {
    const { token } = req.body;
    const googleUser = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const {
      email,
      email_verified,
      //name,
      picture,
      sub,
      given_name,
      family_name,
    } = googleUser.data;

    if (!email_verified) {
      return res.status(400).json({ message: "Email not verified by Google." });
    }

    let user = await UserModel.findOne({ googleId: sub });

    if (!user) {
      user = new UserModel({
        googleId: sub,
        username: given_name.toLowerCase() || lastName.toLowerCase(),
        firstName: given_name,
        lastName: family_name,
        email: email,
        avatar: picture,
        role: "user",
      });
      await user.save();
    }

    const userObject = user.toObject();

    const accessToken = jwt.sign(
      {
        id: userObject._id,
        username: userObject.username,
        role: userObject.role,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1h" }
    );

    res.status(200).json({ ...userObject, accessToken });
  } catch (error) {
    console.error("Google OAuth Error:", error);
    res.status(401).json({ message: "Google authentication failed" });
  }
}

async function register(req, res) {
  const { error } = validateUser(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: error.details.map((err) => err.message) });
  }
  const username = sanitizeInput(req.body.username);
  const password = sanitizeInput(req.body.password);
  const existingUser = await UserModel.findOne({ username }).catch((err) => {
    console.error("Error: ", err);
    res.status(500).json({ message: "Internal server error" });
  });
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
  } else {
    const accessToken = jwt.sign(
      { username, role: "user" },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "1h",
      }
    );
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new UserModel({ username, password: hashedPassword });
    newUser
      .save()
      .then((user) => {
        res.status(201).json({
          _id: user._id.toString(),
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
          email: user.email,
          portfolio: user.portfolio,
          careerObjective: user.careerObjective,
          address: user.address,
          education: user.education,
          skills: user.skills,
          projects: user.projects,
          experience: user.experience,
          accessToken,
        });
      })
      .catch((err) => {
        console.error("Error: ", err);
        res.status(500).json({ message: "Internal server error" });
      });
  }
}

async function update(req, res) {
  try {
    const { error, value } = updateUser.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      console.error("Validation Error:", error.details);
      return res
        .status(400)
        .json({ message: error.details.map((err) => err.message) });
    }

    Object.keys(value).forEach((key) => {
      if (typeof value[key] === "string") {
        value[key] = sanitizeInput(value[key]);
      }
    });
    const user = await UserModel.findOneAndUpdate(
      { _id: value._id, username: value.username },
      value,
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      portfolio: user.portfolio,
      summary: user.summary,
      address: user.address,
      education: user.education,
      skills: user.skills,
      projects: user.projects,
      experience: user.experience,
      certifications: user.certifications,
      languages: user.languages,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      error: "Update Failed",
      message: err.message || "Failed to update user",
    });
  }
}

async function updateEmail(req, res) {
  try {
    const { error, value } = updateUserEmail.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      console.error("Validation Error:", error.details);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, _id } = value;

    const exists = await UserModel.findOne({ email });
    if (exists && exists._id.toString() !== _id) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: _id },
      { email, $currentDate: { lastModified: true } },
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user._id.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      email: user.email,
      portfolio: user.portfolio,
      summary: user.summary,
      address: user.address,
      education: user.education,
      skills: user.skills,
      projects: user.projects,
      experience: user.experience,
      certifications: user.certifications,
      languages: user.languages,
    });
  } catch (e) {
    console.log("Email update failed: ", e);
    res.status(404).json({
      error: "Email Update Failed",
      message: err.message || "Failed to update email",
    });
  }
}

async function build(req, res) {
  const { text } = req.body;
  const sanitizedText = validatePrompt(text);
  if (sanitizedText.error) {
    return res.status(400).json(sanitizedText.error);
  }
  try {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Transfer-Encoding", "chunked");

    const stream = await runCompletion(sanitizedText.text);
    for await (const chunk of stream) {
      res.write(chunk.choices[0]?.delta?.content || "");
    }
    res.end();
  } catch (error) {
    if (error.status === 429) {
      res.status(429).json({
        error: "AI-powered resume builder is currently unavailable.",
        message:
          "The AI-powered resume builder is currently unavailable due to quota limitations. We are working on resolving this, and it will be up and running soon. Thank you for your understanding!",
      });
    } else {
      console.error(error.message);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Something went wrong. Please try again later.",
      });
    }
  }
}

async function forgetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne(email);
    if (!user) return res.status(400).json({ error: "Email not found" });

    if (user.googleId) {
      return res.status(400).json({
        error: "This account uses Google sign-in. Please log in with Google.",
      });
    }

    await TokenModel.deleteOne({ userId: user.id, type: "reset" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 3600 * 1000);
    await new TokenModel({
      token: hash,
      userId: user.id,
      type: "reset",
      expiresAt,
    })
      .save()
      .then(() => {
        console.log("Password reset token saved for user:", user.username);
      })
      .catch((err) => {
        console.error("Error saving reset token:", err);
      });
    const resetLink = `${process.env.RESUMECRAFT_CLIENT_URL}set-new-password?token=${resetToken}`;
    const { subject, html } = getResetpasswordContent(
      user.email,
      user.firstName.toUpperCase() ||
        user.lastName.toUpperCase() ||
        user.username.toUpperCase(),
      resetLink
    );

    transporter.sendMail({
      from: `"ResumeCraft" <${process.env.EMAIL}>`,
      to: user.email,
      subject: subject,
      html: html,
    });
    res.status(200).json({ message: "Password reset token sent" });
  } catch (error) {
    console.error("Error in forget password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { resetToken, newPassword } = req.body;
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const dbToken = await TokenModel.findOne({ token: hash, type: "reset" });

    if (!dbToken || new Date(dbToken.expiresAt) < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const user = await UserModel.findOne({ _id: dbToken.userId });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await TokenModel.deleteOne({ token: hash, type: "reset" });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function guestSession(req, res) {
  try {
    const sessionId = `guest-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newSession = new GuestSessionModel({ sessionId });
    await newSession.save();

    //console.log("Guest session logged:", sessionId);
    res.status(200).json({ message: "Guest session logged successfully." });
  } catch (error) {
    console.error("Error logging guest session:", error);
    res.status(500).json({ error: "Failed to log guest session." });
  }
}

module.exports = {
  login,
  googleOAuth,
  register,
  update,
  updateEmail,
  build,
  guestSession,
  forgetPassword,
  resetPassword,
};
