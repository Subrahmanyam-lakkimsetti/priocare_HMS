const express = require('express');
const apiRouter = require('./api/v1/route');
const AppError = require('./utils/AppError.util');
const errorMiddleware = require('./middlewares/error.middleware');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.get('/', (req, res) => {
  res.json({
    isSuccess: true,
    message: 'Welcome to Priocare HMS Backend',
  });
});

app.use('/api/v1', apiRouter);

app.get('/health-check', (req, res) => {
  res.json({
    isSuccess: true,
    message: 'API is working fine',
  });
});

app.all(/.*/, (req, res, next) => {
  // const err = new Error(`The requested URL ${req.originalUrl} was not found on this server.`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);

  next(
    new AppError(
      `The requested URL ${req.originalUrl} was not found on this server.`,
      404,
    ),
  );
});

app.use(errorMiddleware);

module.exports = app;
