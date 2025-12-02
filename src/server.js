require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const allowedOrigins = [
  "https://resume-craft.onrender.com",
  "http://localhost:3000",
  "https://www.thomastepi.com",
  "https://portfolio-next-app.onrender.com",
  "https://sawyer-camp-farmers.onrender.com",
  "https://bookmart-trw5.onrender.com",
  "https://annette-beauty-spa.onrender.com",

  "https://resumecraft.thomastepi.com",
  "https://sawyercamp.thomastepi.com",
  "https://bookmart.thomastepi.com",
  "https://annette.thomastepi.com",
];

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    exposedHeaders: [
      "RateLimit",
      "Ratelimit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ],
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));

app.options("*", cors());

app.use(express.json());

require("./config/database");

// Importing Routes
const portfolioRoute = require("./routes/portfolio/portfolio.route");

// resumeCraft routes
const resumeUserRoute = require("./routes/resumeCraft/resumeUser.route");
const userResumeTemplateRoute = require("./routes/resumeCraft/userResumeTemplate.route");
const resumeAnalyzerRoute = require("./routes/resumeCraft/resumeAnalyzer.route");

// sawyerCamp routes
const newsletterRouter = require("./routes/sawyerCamp/newsletter.route");
const contactUsRouter = require("./routes/sawyerCamp/contactUs.route");
const paypalRoutes = require("./routes/sawyerCamp/paypal.route");
const analyzeImageRouter = require("./routes/sawyerCamp/aiLab");

// annette beauty spa routes
const checkoutRoute = require("./routes/annetteBeautySpa/checkout.route");

// bookmart routes
const bookUserRoute = require("./routes/bookmart/bookUser.route");
const bookRoute = require("./routes/bookmart/book.route");

app.use("/api/user", resumeUserRoute);
app.use("/api/templates", userResumeTemplateRoute);
app.use("/api/resume", resumeAnalyzerRoute);
app.use("/api/portfolio", portfolioRoute);
app.use("/newsletter", newsletterRouter);
app.use("/contact-us", contactUsRouter);
app.use("/api/sawyer-camp", analyzeImageRouter);
app.use("/api", checkoutRoute);
app.use("/api", paypalRoutes);

app.use("/api/users", bookUserRoute);
app.use("/api/books", bookRoute);

module.exports = app;
