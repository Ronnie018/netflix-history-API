const axios = require("./axios");

class DataExtractor {
  constructor() {}
  static extract(data, { isMovie, isSerie }) {
    if (isMovie) this.movieExtract(data);
    if (isSerie) this.serieExtract(data);
    return data;
  }

  static serieExtract(data) {
    axios.get("/serie/550?").then((res) => {
      console.log(res);
    });
  }
  static movieExtract(data) {}
}

module.exports = DataExtractor;
