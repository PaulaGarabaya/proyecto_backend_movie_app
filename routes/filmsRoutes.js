const express = require('express');
const router = express.Router();

const movieAPI = require("../controllers/filmsApiController.js");
const movieWeb = require("../controllers/filmsWebController.js");
const Film = require("../models/films.model"); //esto me trae el modelo especial de Mongoose para poder interactuar con mi colección

//------------- WEB -------------

// GET ALL FILMS /home/movie/:title
router.get("/search/:title", movieWeb.getAllMovies);

// GET pelcila en detalle
router.get("/search/:title", movieWeb.renderMovieDetail);


// -------------API--------------

// GET /api/movie/:title en detalle
router.get("/api/movie/:title", movieAPI.getMovieByTitle);

// POST /api/movie
router.post("/api/movie", movieAPI.createMovie);

// PUT /api/movie/:id
router.put("/api/movie", movieAPI.updateMovie);

// DELETE /api/movie/:title
router.delete("/api/movie/:title", movieAPI.deleteMovie);

module.exports = router;
