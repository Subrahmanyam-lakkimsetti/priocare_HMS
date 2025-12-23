require('dotenv').config();
const connectToDB = require('./config/db_config');
const app = require('./app');

connectToDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});