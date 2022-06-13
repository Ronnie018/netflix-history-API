const dotenv = require("dotenv").config();

const tmdbSeries = require("../config/tmdbSeries");

const axios = require("./axios");

const queryCreator = require("./queryCreator");

class DataExtractor {
  constructor(data) {
    this.data = data;
    this.final = {
      series: null,
    };
    this.init();
  }

  async init() {
    await this.extractEps();
  }

  getDatesFromSerieObject(eps) {
    const data = eps.map((ep) => {
      return ep.date;
    });
    return data;
  }

  getMostRecentDate(dateArray) {
    const finalDate = {};

    if (dateArray.length === 1) return dateArray[0];

    dateArray.forEach((date, i) => {
      let currentDate = this.getDataObjFromString(date);
      currentDate = {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
        day: currentDate.getDate(),
      };

      if (i === 0) {
        finalDate.year = currentDate.year;
        finalDate.month = currentDate.month;
        finalDate.day = currentDate.day;
      } else {
        if (currentDate.year === finalDate.year) {
          if (currentDate.month === finalDate.month) {
            if (currentDate.day < finalDate.day) {
              finalDate.day = currentDate.day;
            }
          } else if (currentDate.month < finalDate.month) {
            finalDate.month = currentDate.month;
            finalDate.day = currentDate.day;
          }
          if (currentDate.month) {
          }
        } else if (currentDate.year < finalDate.year) {
          finalDate.year = currentDate.year;
          finalDate.month = currentDate.month;
          finalDate.day = currentDate.day;
        }
      }
    });
    return `${this.dateFixer(++finalDate.day)}/${this.dateFixer(
      ++finalDate.month
    )}/${finalDate.year}`;
  }

  dateFixer(string) {
    if (Number(string) > 9) return string;
    return `0${string}`;
  }

  getDataObjFromString(str) {
    const splited = str.split("/");

    return new Date(`${splited[2]}-${splited[1]}-${splited[0]}`);
  }

  getGenre(genreList) {
    if (!genreList || genreList.length === 0) return "unknown";
    const genres = genreList.map((genre) => {
      return tmdbSeries.genres[genre.toString()];
    });
    return genres;
  }

  async extractEps() {
    const series = [];
    Object.values(this.data).forEach(({ Title, Date }) => {
      if (Title.match(/(.+:.+:)/)) {
        const instance = {
          Title: Title.split(":")[0],
          Eps: [{ title: Title, date: Date }],
          Times: 1,
          FirstTime: null,
        };

        const presentTitles = () =>
          series.map(({ Title }) => {
            return Title;
          });

        if (presentTitles().indexOf(instance.Title) === -1) {
          series.push(instance);
        } else {
          const index = presentTitles().indexOf(instance.Title);
          series[index].Times++;
          series[index].Eps.push({
            title: instance.Eps[0].title,
            date: instance.Eps[0].date,
          });
        }
      } 
    });

    series.forEach(async (serie) => {
      try {
        const dates = this.getDatesFromSerieObject(serie.Eps);
        const mostRecent = this.getMostRecentDate(dates);
        serie.FirstTime = mostRecent;
        const query = `/search/tv?${
          process.env.TMDB_API_KEY
        }&query=${queryCreator(serie.Title)}&page=1`;
        const { data } = await axios.get(query);

        if (data.total_results === 0) {
          serie.hasData = false;
          serie.hasExactData = false;
        } else {
          serie.hasData = true;
          if (
            serie.Title.toLowerCase() === data.results[0].name.toLowerCase()
          ) {
            const res = data.results[0];
            serie.genreIds = res.genre_ids.length > 0 ? res.genre_ids : [];
            serie.hasExactData = true;
            serie.originalName = res.name;
            serie.rating = res.vote_average;
            serie.images = [res.backdrop_path, res.poster_path];
            serie.genre = this.getGenre(serie.genreIds);
          }
        }
      } catch (e) {
        console.log("series final error --->>>", e.message);
      }
    });
    this.final.series = series;
  }
}

module.exports = DataExtractor;
