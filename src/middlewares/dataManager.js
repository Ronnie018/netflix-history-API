const express = require("express");

const path = require("path");

const app = express();

const jsonParser = require("csvtojson");

const JsonVerifier = require("../services/JsonVerifier.js");

const DataExtractor = require("../services/DataExtractor.js");

app.use(async (req, res, next) => {
  try {
    const dataPath = `${path.resolve(
      __dirname,
      "..",
      "..",
      "tmp",
      "uploads",
      "data.csv"
    )}`;

    const source = await jsonParser().fromFile(dataPath);

    const jsonVerifier = new JsonVerifier(source);

    if (jsonVerifier.errors.length > 0)
      throw new Error("received data is invalid");

    const finalData = {
      series: [],
      movies: [],
    };

    Object.values(source).forEach(async (value) => {
      const [Title, Date] = Object.values(value);
      if (Title.match(/(.+:\s.+)+/)) {
        const extractedData = DataExtractor.extract(
          { Title, Date },
          { isSerie: true }
        );
        finalData.series.push({ Title, Date });
      } else {
        const extractedData = DataExtractor.extract(
          { Title, Date },
          { isFilm: true }
        );
        finalData.movies.push({ Title, Date });
      }
    });

    req.body.data = finalData;
  } catch (e) {
    res.json({ errors: [e.message] });
  }

  next();
});

module.exports = app;
