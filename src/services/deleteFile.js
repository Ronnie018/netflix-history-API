const path = require("path");

const fs = require("fs");

module.exports = (req) => {
  const fileName = req.body.fileName;
  console.log("after body:::", fileName);
  const dataPath = `${path.resolve(
    __dirname,
    "..",
    "..",
    "tmp",
    "uploads",
    `${fileName}.csv`
  )}`;
  fs.unlink(dataPath, (err) => {
    if (err) {
      return console.log(err.message);
    }
    return console.log("file successfull deleted");
  });
};
