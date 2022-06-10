const axios = require("./axios");

class DataExtractor {
  constructor(data) {
    this.data = data;
    this.final = {
      series: null,
      movies: null,
    };
    this.init();
  }

  init() {
    this.extractEps();
  }

  control() {
    const finalObj = {};
  }

  async extractEps() {
    const series = [];
    await Object.values(this.data).forEach(({ Title, Date }) => {
      if (Title.match(/(.+:.+:)/)) {
        const instance = {
          Title: Title.split(':')[0],
          Eps: [{ title: Title, date: Date }],
          Times: 1

        };

        const presentTitles = series.map(({ Title }) => {
          return Title;
        });

        if (presentTitles.indexOf(instance.Title) === -1) {
          series.push(instance);
        } else {
          const alreadyIn = presentTitles.indexOf(instance.Title);
          series[alreadyIn].Times++
          series[alreadyIn].Eps.push({ title: instance.Eps[0].title, date: instance.Eps[0].date })
        }














        this.final.series = series;
      } else {
        console.log("movie  ", Title);
      }
    });
  }
}

module.exports = DataExtractor;
