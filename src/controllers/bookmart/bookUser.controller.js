const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const BookUser = require("../../models/bookUser.model");

const saltRounds = 10;

async function register(req, res) {
  const { name, email, password } = req.body;
  const user = await BookUser.findOne({ email }).catch((err) => {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  });
  if (user) {
    res.status(400).send("User already exists");
  } else {
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new BookUser({ name, email, password: hashedPassword });
    newUser
      .save()
      .then((user) => {
        res.status(201).send({
          name: user.name,
          email: user.email,
          lastName: user.lastName,
          location: user.location,
          accessToken,
        });
      })
      .catch((err) => {
        console.error("Error: ", err);
        res.status(500).send("Internal server error");
      });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await BookUser.findOne({ email }).catch((err) => {
    console.error("Error: ", err);
    res.status(500).send("Internal server error");
  });
  if (!user) {
    res.status(404).send("User not found");
  } else {
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const role = user.email === "guest@guest.com" ? "guest" : "user";
      const accessToken = jwt.sign(
        { email: user.email, role: role},
        process.env.ACCESS_TOKEN
      );
      res.status(200).send({
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        location: user.location,
        accessToken,
      });
    } else {
      res.status(401).send("Invalid password");
    }
  }
}

async function updateUser(req, res) {
  const { name, email, lastName, location } = req.body;
  try {
    const user = await BookUser.findOne({ email });
    if (!user) {
      return res.status(400).send("Email must be unique");
    }
    user.name = name;
    user.email = email;
    user.lastName = lastName;
    user.location = location;

    const updatedUser = await user.save();

    res.status(200).send({
      name: updatedUser.name,
      email: updatedUser.email,
      lastName: updatedUser.lastName,
      location: updatedUser.location,
    });
  } catch (err) {
    console.error("Error: ", err);
    return res.status(500).send("Internal server error");
  }
}

module.exports = {
  register,
  login,
  updateUser,
};
