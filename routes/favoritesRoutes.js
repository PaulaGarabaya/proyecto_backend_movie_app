// favoritesRoutes.js MODIFICADO
const express = require('express');
const { 
    getFavoritesView, 
    getFavorites, 
    addFavorite, 
    removeFavorite 
} = require('../controllers/favoritesController');
const { isAuthenticated } = require('../middlewares/auth'); // ← CORREGIDO

const router = express.Router();

//------------- WEB -------------
// [GET] http://localhost:3000/favorites - Vista de favoritos
router.get('/favorites', isAuthenticated, getFavoritesView);
// -------------API--------------
// [GET] http://localhost:3000/api/favorites - Obtener películas favoritas
router.get('/api/favorites', isAuthenticated, getFavorites);

// [POST] http://localhost:3000/api/favorites - Añadir favorito
router.post('/api/favorites', isAuthenticated, addFavorite);

// [DELETE] http://localhost:3000/api/favorites/:id - Eliminar favorito
router.delete('/api/favorites/:id', isAuthenticated, removeFavorite);

module.exports = router;