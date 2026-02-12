// DEPENDENCIES
const dotenv = require("dotenv");

// MIDDLEWARS
dotenv.config({ path: "./config.env" });

function debugLog(message) {
  // Check enviroment form NODE_ENV & det variables
  if (
    process.env.NODE_ENV === "local" ||
    process.eventNames.NODE_ENV === "development"
  ) {
    console.debug(message);
  }
}

function infoLog(message) {
  // Check enviroment form NODE_ENV & det variables
  if (
    process.env.NODE_ENV === "local" ||
    process.eventNames.NODE_ENV === "development"
  ) {
    console.log(message);
  }
}

function warningLog(message) {
  if (
    process.env.NODE_ENV === "local" ||
    process.eventNames.NODE_ENV === "development" ||
    process.eventNames === "production"
  ) {
    console.warn(message);
  }
}

function criticalLog(message) {
  if (
    process.env.NODE_ENV === "local" ||
    process.eventNames.NODE_ENV === "development" ||
    process.eventNames === "production"
  ) {
    console.trace(message);
  }
}

function errorlLog(message) {
  if (
    process.env.NODE_ENV === "local" ||
    process.eventNames.NODE_ENV === "dev" ||
    process.eventNames.NODE_ENV === "stage" ||
    process.eventNames === "prof"
  ) {
    console.error(message);
  }
}

module.exports = { debugLog, infoLog, warningLog, criticalLog, errorlLog };
