const express = require("express");
const Router = express.Router();
const predictionControoller = require('../controllers/predictionController')


Router.post("/prediction", predictionControoller.predictions);
// Router.get("/download/pdf/:pdf", predictionControoller.downloadPdf);

module.exports = Router;