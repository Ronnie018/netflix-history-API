const express = require("express");

const path = require("path");

const app = express();

const jsonParser = require("csvtojson");

const JsonVerifier = require("../services/JsonVerifier.js");

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

    Object.values(source).forEach((value) => {
      const [Title, Date] = Object.values(value);
      if (Title.match(/(.+:\s.+)+/)) finalData.series.push({ Title, Date });
      else finalData.movies.push({ Title, Date });
    });

    req.body.data = finalData;
  } catch (e) {
    res.json({ errors: [e.message] });
  }

  next();
});

module.exports = app;
