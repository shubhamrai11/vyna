const { statusCodes } = require("./constant");

//General error
class CommonError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends CommonError {
  constructor(message) {
    super(message);
    (this.name = "Bad reques"),
      (this.statusCode = statusCodes.BAD_REQUEST),
      (this.status = false);
  }
}

class PageNotFoundError extends CommonError {
  constructor(message) {
    super(message);
    (this.name = "Page not found"),
      (this.statusCode = statusCodes.NOT_FOUND),
      (this.status = false);
  }
}

class UnauthorizedError extends CommonError {
  constructor(message) {
    super(message);

    (this.name = "Unauthorized"),
      (this.statusCode = statusCodes.UNAUTHORIZED),
      (this.status = false);
  }
  
}

module.exports = {
  PageNotFoundError,
  ValidationError,
  UnauthorizedError,
};
