const express = require("express");
const env = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

// load env vars
env.config({ path: "./config/config.env" });

// middleware
// const logger = require("./middlewares/logger");

// Database Config
connectDB();

// Route Files
const bootcampRouter = require("./routes/bootcamps");
const coursesRouter = require("./routes/courses");


const app = express();

app.use([express.json()])

if(process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use(logger);

app.use("/api/v1/bootcamps",bootcampRouter);
app.use("/api/v1/courses",coursesRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.cyan.underline.bold);
});


// handler unhandled promises

process.on("unhandledRejection",(err,promise) => {
  console.log(`ERROR: ${err.message}`.red);
  // Close Server and exit process 
  server.close(() => {process.exit(1)});
})

// process.on("SIGTERM", shutDown);
// process.on("SIGINT", shutDown);
// process.on("unhandledRejection", shutDown);
// process.on("uncaughtException", shutDown);