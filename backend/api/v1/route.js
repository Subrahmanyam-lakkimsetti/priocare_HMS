const express = require("express");
const authRouter = require("./auth/auth.route");

const apiRouter = express.Router();

// Importing route modules
apiRouter.use("/auth", authRouter);


module.exports = apiRouter;