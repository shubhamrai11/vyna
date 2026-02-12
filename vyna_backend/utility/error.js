const { statusCodes } = require("./constant");

//User error
class UserError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

//User Not Found Error
class UserNotFoundError extends UserError {
  constructor(message) {
    super(message);
    this.name = "Not found";
    this.statusCode = statusCodes.NOT_FOUND;
    this.status = false;
  }
}

//Blog error
class BlogError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

//Blog Not Found Error
class BlogNotFoundError extends BlogError {
  constructor(message) {
    super(message);
    this.name = "Not found";
    this.statusCode = statusCodes.NOT_FOUND;
    this.status = false;
  }
}
//comment error
class CommentError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

//comment Not Found Error
class CommentNotFoundError extends CommentError {
  constructor(message) {
    super(message);
    this.name = "Not found";
    this.statusCode = statusCodes.NOT_FOUND;
    this.status = false;
  }
}

class ProductError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

//product Not Found Error
class ProductNotFoundError extends ProductError {
  constructor(message) {
    super(message);
    this.name = "Not found";
    this.statusCode = statusCodes.NOT_FOUND;
    this.status = false;
  }
}

class VideoError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

//product Not Found Error
class VideoNotFoundError extends VideoError {
  constructor(message) {
    super(message);
    this.name = "Not found";
    this.statusCode = statusCodes.NOT_FOUND;
    this.status = false;
  }
}

class AdminError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class AdminNotFoundError extends AdminError {
  constructor(message) {
    super(message);
    this.name = "Not found";
    this.statusCode = statusCodes.NOT_FOUND;
    this.stack = false;
  }
}

class OrderError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = false;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class OrderNotFoundError extends OrderError {
  constructor(message) {
    super(message);
    this.name = "Not found";
    this.statusCode = statusCodes.NOT_FOUND;
    this.stack = false;
  }
}

module.exports = {
  UserError,
  UserNotFoundError,
  BlogError,
  BlogNotFoundError,
  CommentError,
  CommentNotFoundError,
  ProductError,
  ProductNotFoundError,
  VideoError,
  VideoNotFoundError,
  AdminError,
  AdminNotFoundError,
  OrderError,
  OrderNotFoundError,
};
