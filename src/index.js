require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const dataRoutes = require("./routes/dataRoutes");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(dataRoutes);

app.use(morgan("dev"));

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
