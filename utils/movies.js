const axios = require("axios");
const cheerio = require("cheerio");

const getMovies = async () => {
  const { data } = await axios.get(
    "https://wiflix.surf/film-en-streaming/page/${page}/"
  );
  $ = cheerio.load(data);

  const movieData = $("a.mov-t").map((_, element) => ({
    title: $(element).text(),
    url: $(element).attr("href"),
  }));
  return movieData;
};

const movies = { getMovies };
module.exports = movies;
