const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json())

app.get("/health-check", (req, res) => {
    res.json({
        status : "success",
        message: "API is working fine"
    })
})

module.exports = app;