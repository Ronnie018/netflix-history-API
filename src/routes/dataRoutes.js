const multer = require("multer");

const multerConfig = require("../config/multer.js");

const dataRoutes = require("express").Router();

const dataManager = require("../middlewares/dataManager");

dataRoutes.post(
  "/myData",
  multer(multerConfig).single("myData"),
  dataManager,
  (req, res) => {
    const data = req.body.data;
    res.status(200).json({ data });
  }
);

module.exports = dataRoutes;
