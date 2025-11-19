const Film = require('../models/films.model');  //esto me trae el modelo especial de Mongoose para poder interactuar con mi colección
require('dotenv').config(); //para cargar
const fetchFilm = require('../utils/fetchFilms');

// [GET] /search/:title // Buscar películas
async function getAllMovies(req, res) {
  const title = req.params.title;

  try {
    const film = await fetchFilm.fetchAllFilms(title);     // 1. Buscar primero en OMDB

    if (film) {
      return res.status(200).json(film);
    }
    const localFilm = await Film.findOne({     // 2. Si no está en OMDB, buscar en MongoDB
      Title: new RegExp(`^${title}$`, 'i') // búsqueda insensible a mayúsculas
    });
    if (localFilm) {
      return res.status(200).json(localFilm);
    }

    return res  // 3. Si no existe en ninguna fuente
      .status(404)
      .json({ message: 'Film not found in OMDB or local database' });

  } catch (error) {
    console.error("Error retrieving movie:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}


const renderSearch = (req, res) => {
  res.render("search");
};

// moviesWeb.controller.js

const renderMovieDetail = async (req, res) => {
  try {
    const { title } = req.params;

    let movies = await fetchFilm.fetchOneFilm(title);

    if (!movies || movies.length === 0) {
      return res.status(404).render("detalle", { movie: null, message: "Película no encontrada" });
    }

    // Como solo quieres 1 peli:
    const movie = movies[0];

    res.render("details", { movie });
  } catch (error) {
    console.error(error);
    res.status(500).render("detalle", { movie: null, message: "Error al cargar la película" });
  }
};



module.exports = {
  getAllMovies,
  renderSearch,
  renderMovieDetail
};