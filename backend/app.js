const express = require('express');
const cors = require('cors');
const apiRouter = require('./api/v1/route');

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

module.exports = app;
