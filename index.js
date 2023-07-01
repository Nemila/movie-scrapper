const app = require("express")();
const movies = require("./utils/movies");

app.get("/", (req, res) => {
  res.send(`Welcome`);
});

app.get("/films/:page", async (req, res) => {
  const { page } = req.params;
  const data = page ? await movies.getMovies(page) : await movies.getMovies(1);
  res.status(200).send(data);
});

app.listen(3000, () => console.log("Running on port 3000."));
