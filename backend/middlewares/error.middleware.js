const errorMiddleware = (err, req, res, next) => {
  console.log(`error: ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status: status,
    message: err.message,
  });
};

module.exports = errorMiddleware;
