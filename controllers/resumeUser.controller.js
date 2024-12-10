const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/resumeUser.model");
const runCompletion = require("../config/openai");

const saltRounds = 10;

async function login(req, res) {
  const { username, password } = req.body;
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
        careerObjective: user.careerObjective,
        address: user.address,
        education: user.education,
        skills: user.skills,
        projects: user.projects,
        experience: user.experience,
        accessToken,
      });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  }
}

async function register(req, res) {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username }).catch((err) => {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  });
  if (user) {
    res.status(400).send("User already exists");
  } else {
    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN);
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
  const newUserData = req.body;
  try {
    await UserModel.findOneAndUpdate({ username: req.body.username }, req.body);
    const user = await UserModel.findOne({ username: newUserData.username });
    res.send({
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
    });
  } catch (err) {
    console.log(err);
    res.status(404).json("Update Failed");
  }
}

async function build(req, res) {
  const { text } = req.body;
  try {
    const response = await runCompletion(text);
    res.json({ data: response.choices });
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

module.exports = {
  login,
  register,
  update,
  build,
};
