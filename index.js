const app = require("express")();
const movies = require("./utils/movies");

app.get("/", (req, res) => {
  res.status(200).json({
    title: "Bienvenue sur FilmFR!",
    message: "Fait par Lamine Diamoutene.",
  });
});

app.get("/films", async (req, res) => {
  const { page } = req.query;
  const data = page ? await movies.getMovies(page) : await movies.getMovies(1);
  res.status(200).json(data);
});

app.get("/films/:id", async (req, res) => {
  const { id } = req.params;
  const data = await movies.getEmbedUrls(id);
  res.status(200).send(data);
});

app.listen(3000, () => console.log("Running on port 3000."));
