const express = require("express");

const path = require("path");

const app = express();

const jsonParser = require("csvtojson");

const JsonVerifier = require("../services/JsonVerifier.js");

const DataExtractor = require("../services/DataExtractor.js");

app.use(async (req, res, next) => {
  try {
    const fileName = req.body.fileName;
    const dataPath = `${path.resolve(
      __dirname,
      "..",
      "..",
      "tmp",
      "uploads",
      `${fileName}.csv`
    )}`;

    const source = await jsonParser({
      headers: ["Title", "Date"],
      alwaysSplitAtEOL: true,
    }).fromFile(dataPath);

    const jsonVerifier = new JsonVerifier(source);

    if (jsonVerifier.errors.length > 0)
      throw new Error("received data is invalid");

    async function getExtractData() {
      console.log("running");
      const data = await new DataExtractor(source);
      return data.final;
    }

    const finalData = await getExtractData();

    req.body.data = finalData;
  } catch (e) {
    res.json({ errors: [e.message] });
  }

  next();
});

module.exports = app;
