require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "https://resume-craft.onrender.com",
  "http://localhost:3000",
  "https://www.thomastepi.com",
  "https://www.thomastepi.info",
  "https://sawyer-camp-farmers.onrender.com",
  "https://bookmart-trw5.onrender.com",
  "https://annette-beauty-spa.onrender.com/",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const bookUserRoute = require("./routes/bookUser.route");
const bookRoute = require("./routes/book.route");

const port = process.env.PORT || 5000;
require("./config/database");
const resumeUserRoute = require("./routes/resumeUser.route");
const portfolioRoute = require("./routes/portfolio.route");
const newsletterRouter = require("./routes/newsletter.route");
const contactUsRouter = require("./routes/contactUs.route");
const checkoutRoute = require("./routes/checkout.route");

app.use(express.json());
app.use("/api/user", resumeUserRoute);
app.use("/api/portfolio", portfolioRoute);
app.use("/newsletter", newsletterRouter);
app.use("/contact-us", contactUsRouter);
app.use("/api", checkoutRoute);

app.use("/api/users", bookUserRoute);
app.use("/api/books", bookRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
