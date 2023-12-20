const express = require("express");
const UserModel = require("../models/userModel");
import('node-fetch');
const runCompletion = require("../openai");


const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const result = await UserModel.findOne({
      username: req.body.username,
      password: req.body.password,
    });
    if (result) {
      res.send(result);
    } else {
      res.status(404).json("User not found");
    }
  } catch (err) {
    console.log(err);
    res.stastus(404).json("User not found");
  }
});

router.post("/register", async (req, res) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.send("registration successful");
  } catch (err) {
    console.log(err);
    res.stastus(404).json({ message: "Registration Failed" });
  }
});

router.post("/update", async (req, res) => {
  try {
    await UserModel.findOneAndUpdate({ _id: req.body._id }, req.body);
    const user = await UserModel.findOne({ _id: req.body._id });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Registration Failed" });
  }
});

router.post("/build", async (req, res) => {
  const { text } = req.body;
  try {
    const response = await runCompletion(text);
    //console.log(response);
    res.json({ data: response.choices });
  } catch (error) {
    if (error.response) {
      console.error(error.response.data, error.response.status);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error("Something went wrong", error.messsage);
      res.status(500).json({ error: { message: "Something went wrong" } });
    }
  }
});

module.exports = router;
