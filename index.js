const express = require("express");
const app = express();
const movies = require("./utils/movies");
const asyncHandler = require("express-async-handler");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    title: "Bienvenue sur FilmFR!",
    message: "Fait par Lamine Diamoutene.",
    indexes: [
      {
        url: "/films?page=",
        description: "Liste des films.",
      },
      {
        url: "/films/animations?page=",
        description: "Liste des films d'animation.",
      },
      {
        url: "/search?story=",
        description: "Recherchez un film.",
      },
      {
        url: "/films/:id",
        description: "Liens d'integration du film.",
      },
    ],
  });
});

app.get(
  "/films",
  asyncHandler(async (req, res) => {
    const { page } = req.query;
    const data = page
      ? await movies.getMovies(page)
      : await movies.getMovies(1);
    res.status(200).json(data);
  })
);

app.get(
  "/films/animations",
  asyncHandler(async (req, res) => {
    const { page } = req.query;
    const data = page
      ? await movies.getAnimations(page)
      : await movies.getAnimations(1);
    res.status(200).json(data);
  })
);

app.get(
  "/films/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await movies.getEmbedUrls(id);
    res.status(200).json(data);
  })
);

app.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { story } = req.query;
    if (!story) throw new Error("The story parameter is missing.");
    const data = await movies.searchMovie(story);
    res.status(200).send(data);
  })
);

app.use((err, req, res, next) => {
  if (err) {
    res.json({
      error: err.message,
    });
    next();
  }
});

app.listen(3000, () => console.log("Running on port 3000."));
