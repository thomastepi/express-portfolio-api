const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/resumeUser.model");
const GuestSessionModel = require("../models/resumeGuestUser.model");
const runCompletion = require("../config/openai");
const {
  validateUser,
  updateUser,
  sanitizeInput,
  validatePrompt,
} = require("../utils/resumeCraft/validation");

const saltRounds = 10;

async function login(req, res) {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  username = sanitizeInput(req.body.username);
  password = sanitizeInput(req.body.password);

  const user = await UserModel.findOne({ username }).catch((err) => {
    console.error("Error: ", err);
    res.status(500).json({ error: "Internal server error" });
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const role = user.username === "guest" ? "guest" : "user";
      const accessToken = jwt.sign(
        { username: user.username, role: role },
        process.env.ACCESS_TOKEN
      );
      res.status(200).json({
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
      res.status(401).json({ error: "Invalid password" });
    }
  }
}

async function register(req, res) {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json(error.details.map((err) => err.message));
  }

  const username = sanitizeInput(req.body.username);
  const password = sanitizeInput(req.body.password);
  const existingUser = await UserModel.findOne({ username }).catch((err) => {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  });
  if (existingUser) {
    res.status(400).send("User already exists");
  } else {
    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new UserModel({ username, password: hashedPassword });
    newUser
      .save()
      .then((user) => {
        res.status(201).send({
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
        res.status(500).send("Internal server error");
      });
  }
}

async function update(req, res) {
  try {
    const { error, value } = updateUser.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    Object.keys(value).forEach((key) => {
      if (typeof value[key] === "string") {
        value[key] = sanitizeInput(value[key]);
      }
    });
    const user = await UserModel.findOneAndUpdate(
      { username: value.username },
      value,
      {
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ error: ["User not found"] });
    }
    res.send({
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
    res.status(404).json({ error: ["Update Failed"] });
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
      res
        .status(429)
        .json(
          "The AI-powered resume builder is currently unavailable due to quota limitations. We are working on resolving this, and it will be up and running soon. Thank you for your understanding!"
        );
    } else {
      console.error(error.message);
      res.status(500).json("Internal server error");
    }
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
    res.status(200).send({ message: "Guest session logged successfully." });
  } catch (error) {
    console.error("Error logging guest session:", error);
    res.status(500).send({ error: "Failed to log guest session." });
  }
}

module.exports = {
  login,
  register,
  update,
  build,
  guestSession,
};
