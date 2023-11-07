// Load environment variables from a .env file
import dotenv from "dotenv";
// Import the express module to create an HTTP server
import express from "express";
// Import rate limiting middleware to prevent abuse
import rateLimit from "express-rate-limit";
// Import CORS middleware to enable cross-origin requests
import cors from "cors";
// Import weather routing module
import weather from "./weather/index.js";

// Initialize configuration from .env file
dotenv.config();

// Create an Express application instance
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static("public"));
// Define a whitelist of domains for CORS
const whitelist = [
  "http://127.0.0.1",
  "http://127.0.0.1:5500",
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
app.use(cors(corsOptions));

// Configure rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10), // Time window in milliseconds
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10), // Maximum number of requests per window
});
app.use(limiter);

// Define a route for the root path
app.get("/", (req, res) => res.json({ success: "Hello World" }));

// Use weather router for all requests to /weather
app.use("/weather", weather);

// Start the server on the specified port, falling back to 3000 if not specified
app.listen(process.env.PORT || 3000, () =>
  console.log(`App listening on port ${process.env.PORT}`)
);
