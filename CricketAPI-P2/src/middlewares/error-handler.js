class AppError extends Error {
  constructor(errorType, message, statusCode, details = []) {
    super(message);
    this.errorType = errorType;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorType = err.errorType || 'Internal Server Error';
  const message = err.message || 'Something went wrong on the server';
  
  const response = {
    success: false,
    error: errorType,
    message: message
  };

  if (err.details && err.details.length > 0) {
    response.details = err.details;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  errorHandler
};
