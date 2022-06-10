const multer = require("multer");

const multerConfig = require("../config/multer.js");

const dataRoutes = require("express").Router();

const dataManager = require("../middlewares/dataManager");

const hashGen = require("../services/hashGen");

const path = require("path");

const deleteFile = require("../services/deleteFile.js");

dataRoutes.post(
  "/generate",

  multer(multerConfig(hashGen())).single("myData"),
  dataManager,
  (req, res, next) => {
    const data = req.body.data;
    res.status(200).json({ data });
    next();
  },
  (req, res) => {
    deleteFile(req);
  }
);

module.exports = dataRoutes;
