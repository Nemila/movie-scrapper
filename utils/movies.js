const axios = require("axios");
const cheerio = require("cheerio");
const asyncHandler = require("express-async-handler");

const getMovies = asyncHandler(async (page) => {
  const { data } = await axios.get(
    `https://wiflix.surf/film-en-streaming/page/${page}/`
  );
  $ = cheerio.load(data);

  const movieData = $("div.mov")
    .map((_, element) => {
      const image =
        "https://wiflix.surf/" + $(element).find(".mov-i img").attr("src");
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
        image,
        title,
        genres,
      };
    })
    .get();

  return { number: movieData.length, data: movieData };
});

const getAnimations = asyncHandler(async (page) => {
  const { data } = await axios.get(
    `https://wiflix.surf/film-en-streaming/animation/page/${page}/`
  );
  $ = cheerio.load(data);

  const movieData = $("div.mov")
    .map((_, element) => {
      const image =
        "https://wiflix.surf/" + $(element).find(".mov-i img").attr("src");
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
        image,
        title,
        genres,
      };
    })
    .get();

  return { number: movieData.length, data: movieData };
});

const getEmbedUrls = asyncHandler(async (id) => {
  const { data } = await axios.get(
    `https://wiflix.surf/film-en-streaming/${id}.html`
  );
  $ = cheerio.load(data);

  const embedUrls = $(".tabs-sel > a")
    .map((_, element) => ({
      provider: $(element).find("span").text().toLowerCase(),
      url: $(element).attr("href").split("?u=")[1],
    }))
    .get();

  return embedUrls;
});

const searchMovie = asyncHandler(async (story) => {
  const { data } = await axios.post(
    `https://wiflix.surf/index.php?story=${story}&do=search&subaction=search`
  );

  $ = cheerio.load(data);

  const movieData = $("div.mov:nth-of-type(n+2)")
    .map((_, element) => {
      const url = $(element).find("a").first().attr("href");
      if (!url.includes("film-en-streaming")) return;

      const image =
        "https://wiflix.surf/" + $(element).find(".mov-i img").attr("src");
      const genres = $(element)
        .find(".nbloc3 a")
        .map((_, el) => $(el).text())
        .get();
      const title = $(element).find("a").first().text();
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
});

const movies = { getMovies, getAnimations, getEmbedUrls, searchMovie };
module.exports = movies;
