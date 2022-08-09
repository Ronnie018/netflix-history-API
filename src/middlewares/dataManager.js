const express = require("express");

const path = require("path");

const app = express();

const jsonParser = require("csvtojson");

const JsonVerifier = require("../services/JsonVerifier.js");

const DataExtractor = require("../services/DataExtractor.js");

app.use(async (req, res, next) => {
  try {
    const fileName = await req.body.fileName;
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
      const data = new DataExtractor(source);
      await data.init();
      console.log("dado peego");
      return data.final;
    }

    const finalData = await getExtractData();

    req.body.data = finalData;
    console.log("data already sended");
    console.log(req.body.data);
    setTimeout(() => {
      next();
    }, 20000);
  } catch (e) {
    res.json({ errors: [e.message] });
  }
});

module.exports = app;
