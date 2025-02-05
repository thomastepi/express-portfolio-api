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
  "https://annette-beauty-spa.onrender.com",

  "https://resumecraft.thomastepi.com",
  "https://sawyercamp.thomastepi.com",
  "https://bookmart.thomastepi.com",
  "https://annette.thomastepi.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

require("./config/database");
const resumeUserRoute = require("./routes/resumeUser.route");
const portfolioRoute = require("./routes/portfolio.route");
const newsletterRouter = require("./routes/newsletter.route");
const contactUsRouter = require("./routes/contactUs.route");
const checkoutRoute = require("./routes/checkout.route");
const paypalRoutes = require("./routes/paypal.route");
const bookUserRoute = require("./routes/bookUser.route");
const bookRoute = require("./routes/book.route");

app.use("/api/user", resumeUserRoute);
app.use("/api/portfolio", portfolioRoute);
app.use("/newsletter", newsletterRouter);
app.use("/contact-us", contactUsRouter);
app.use("/api", checkoutRoute);
app.use("/api", paypalRoutes);

app.use("/api/users", bookUserRoute);
app.use("/api/books", bookRoute);

module.exports = app;
