const express = require("express");
const Router = express.Router();
const authController = require("./../controllers/authController");

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);
Router.get("/logout", authController.logout);

module.exports = Router;