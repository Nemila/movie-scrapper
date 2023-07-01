const axios = require("axios");
const cheerio = require("cheerio");
// const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");

async function getHrefs(page) {
  try {
    // Step 1: Fetch the main URL and get hrefs from .mov elements
    process.stdout.write(`\nFetching PAGE ${page} URL...\n`);
    const mainResponse = await axios.get(
      `https://wiflix.surf/film-en-streaming/page/${page}/`
    );
    const $ = cheerio.load(mainResponse.data);

    const movieData = $("a.mov-t")
      .map((_, element) => ({
        title: $(element).text(),
        url: $(element).attr("href"),
      }))
      .get();
    process.stdout.write(
      `Step 1 completed. Total movies: ${movieData.length}\n`
    );

    // Step 2: Navigate to each href and get hrefs from .linkstab elements
    const movieEmbed = [];
    let counter = 0;
    for (const movie of movieData) {
      counter++;
      process.stdout.write(`\rProcessing movie ${counter}/${movieData.length}`);
      const response = await axios.get(movie.url);
      const html = response.data;
      const inner$ = cheerio.load(html);
      const innerHrefs = inner$(".linkstab a")
        .map((_, element) => inner$(element).attr("href").split("?u=")[1])
        .get();
      movieEmbed.push({ ...movie, embed: innerHrefs });
    }
    process.stdout.write(`\nStep 2 completed. Movies processed: ${counter}`);

    // Step 3: Log the resulting array
    //   fs.writeFile("./movies.json", JSON.stringify(movieEmbed), (err) => {
    //     if (err) console.error(err);
    //     process.stdout.write("\nFile updated with success!");
    //   });

    return { page: page, length: movieEmbed.length, data: movieEmbed };
  } catch (error) {
    console.error("Error:", error);
  }
}

// getHrefs();
app.get("/", (req, res) => {
  res.send("Bienvenue sur filmfr | Fait par Lamine Diamoutene");
});

app.get("/films", async (req, res) => {
  const { page } = req.query;
  const data = page ? await getHrefs(page) : await getHrefs(1);
  res.status(200).send(data);
});

app.listen(3000);
