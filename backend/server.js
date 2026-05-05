require('dotenv').config();
const http = require('http');
const connectToDB = require('./config/db_config');
const app = require('./app');
const { initSocket } = require('./utils/socket');
const { scheduleReminders } = require('./services/reminder.service');

connectToDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

scheduleReminders();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
