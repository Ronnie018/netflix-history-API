const axios = require("./axios");

class DataExtractor {
  constructor(data) {
    this.data = data;
    this.init();
    this.final = {
      series: [],
      movies: [],
    };
  }

  init() {
    this.extractEps();
  }

  control() {
    const finalObj = {};
  }

  extractEps() {
    console.log("extracting 1st");
    // Object.values(this.data).forEach((elm) => {
    //   if (Title.match(/(.+:.+:)/)) {
    //     console.log("serie  ", Title);
    //   } else {
    //     console.log("movie  ", Title);
    //   }
    // });
  }
}

module.exports = DataExtractor;
