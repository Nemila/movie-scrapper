const axios = require("axios");
const cheerio = require("cheerio");

const getMovies = async (page) => {
  const { data } = await axios.get(
    `https://wiflix.surf/film-en-streaming/page/${page}/`
  );
  $ = cheerio.load(data);

  const movieData = $("a.mov-t")
    .map((_, element) => {
      const url = $(element).attr("href");
      var start = url.lastIndexOf("/") + 1;
      var end = url.lastIndexOf(".html");

      return {
        id:
          start !== -1 && end !== -1 && start < end
            ? url.substring(start, end)
            : url,
        title: $(element).text(),
      };
    })
    .get();

  return movieData;
};

const getEmbedUrls = async (id) => {
  const { data } = await axios.get(
    `https://wiflix.surf/film-en-streaming/${id}.html`
  );
  $ = cheerio.load(data);

  const embedUrls = $(".tabs-sel > a")
    .map((_, element) => $(element).attr("href").split("?u=")[1])
    .get();

  return embedUrls;
};

const movies = { getMovies, getEmbedUrls };
module.exports = movies;
