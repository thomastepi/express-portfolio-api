require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const allowedOrigins = [
  "https://resume-craft.onrender.com",
  "http://localhost:3000",
  "https://www.thomastepi.com",
  "https://www.thomastepi.info",
  "https://sawyer-camp-farmers.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
const port = process.env.PORT || 5000;
require("./config/database");
const userRoute = require("./routes/resumeUser.route");
const portfolioRoute = require("./routes/portfolio.route");
const newsletterRouter = require("./routes/newsletter.route");
const contactUsRouter = require("./routes/contactUs.route");

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/portfolio", portfolioRoute);
app.use("/newsletter", newsletterRouter);
app.use("/contact-us", contactUsRouter);

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
