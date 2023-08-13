const express = require("express");
const dotnev = require("dotenv");
const path = require("path");
const cors = require("cors");
const routers = require("./routers/index");
const hpp = require("hpp");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const connectDatabase = require("./helpers/database/connectDatabase");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const corsOptions = require("./helpers/security/cors");

// Environment Variables
dotnev.config({
  path: "./config/env/config.env",
});

// Database
connectDatabase();

// Express
const app = express();

// Cors
app.use(cors(corsOptions));

// Mongo Sanitize
app.use(mongoSanitize());

// Helmet
app.use(helmet());

// Hpp
app.use(hpp());

// Express - Body Middleware
app.use(express.json());

// Port
const PORT = process.env.PORT;

// Routers Middleware
app.use("/api", routers);

// Error Handler
app.use(customErrorHandler);

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Server Listening
app.listen(PORT, () => {
  console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
});
