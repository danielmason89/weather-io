import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import weather from "./weather.js";

// Define a whitelist of domains for CORS
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://danielmason89.github.io/daniel-mason-project-submission-for-intro-to-development/",
  "https://65496f9271ad240ef5ea17e2--silver-sopapillas-a40fba.netlify.app/",
];

// Set up CORS options, allowing requests from whitelisted domains and handling errors
// In your CORS options, consider adding a check for the 'null' origin.
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // For legacy browser support (IE)
};

// Configure rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10), // Time window in milliseconds
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10), // Maximum number of requests per window
});

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(limiter);

// Define a route for the root path
app.get("/", (req, res) => res.json({ success: "Welcome to WeatherCheck.io API" }));

// Use weather router for all requests to /weather
app.use("/weather", weather);

// Start the server on the specified port, falling back to 3000 if not specified
app.listen(process.env.PORT || 3000, () =>
  console.log(`App listening on port ${process.env.PORT}`)
);
