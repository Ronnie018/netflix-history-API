const multer = require("multer");

const multerConfig = require("../config/multer.js");

const dataRoutes = require("express").Router();

const dataManager = require("../middlewares/dataManager");

const hashGen = require('../services/hashGen')

dataRoutes.post(
  "/generate",
  
  multer(multerConfig(hashGen())).single("myData"),
  dataManager,
  (req, res) => {
    const data = req.body.data;
    res.status(200).json({ data });
  }
);

module.exports = dataRoutes;
