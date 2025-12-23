const mongoose = require("mongoose");

const db_connection_url = process.env.DB_CONNECTION_STRING;

const connectToDB = async () => {
    try {
        mongoose.connect(db_connection_url);
        console.log("-----db connected sucessfully-----");
    } catch (error) {
        console.log("----Error connecting to DB-------");
        console.log(error.message);
    }
}


module.exports = connectToDB;