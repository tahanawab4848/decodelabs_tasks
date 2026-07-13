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
  
  if (err.name === 'ValidationError') {
    response.error = 'Validation Error';
    response.message = err.message;
    res.status(400).json(response);
    return;
  }
  
  if (err.name === 'CastError') {
    response.error = 'Invalid ID';
    response.message = `Resource not found with id of ${err.value}`;
    res.status(404).json(response);
    return;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  AppError,
  errorHandler
};
