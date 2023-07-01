const axios = require("axios");
const cheerio = require("cheerio");

const getMovies = async (page) => {
  const { data } = await axios.get(
    `https://wiflix.surf/film-en-streaming/page/${page}/`
  );
  $ = cheerio.load(data);

  const movieData = $("div.mov")
    .map((_, element) => {
      const genres = $(element)
        .find(".nbloc3 a")
        .map((_, el) => $(el).text())
        .get();
      const title = $(element).find("a").first().text();
      const url = $(element).find("a").first().attr("href");
      var start = url.lastIndexOf("/") + 1;
      var end = url.lastIndexOf(".html");
      const id =
        start !== -1 && end !== -1 && start < end
          ? url.substring(start, end)
          : url;

      return {
        id,
        title,
        genres,
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
