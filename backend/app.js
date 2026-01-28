const express = require('express');
const cors = require('cors');
const apiRouter = require('./api/v1/route');
const errorController = require('./api/v1/error.controller');
const AppError = require('./utils/AppError.util');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to Priocare HMS Backend',
  });
});

app.use('/api/v1', apiRouter);

app.get('/health-check', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working fine',
  });
});

app.all(/.*/, (req, res, next) => {
  // const err = new Error(`The requested URL ${req.originalUrl} was not found on this server.`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);

  next(new AppError(`The requested URL ${req.originalUrl} was not found on this server.`, 404));
});

app.use(errorController);

module.exports = app;
