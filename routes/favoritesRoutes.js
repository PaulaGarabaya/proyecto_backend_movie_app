
const express = require('express');



const router = express.Router();
//------------- WEB -------------
<<<<<<< Updated upstream
//[GET] http://localhost:3000/favorites 
router.get('/favorites');
=======
// [GET] http://localhost:3000/favorites - Vista de favoritos
router.get('/favorites', isAuthenticated, getFavoritesView);
>>>>>>> Stashed changes

// -------------API--------------
//[GET] http://localhost:3000/api/favorites Obtener películas favoritas del usuario
router.get('/api/favorites'); // Listar favoritos
//[POST] http://localhost:3000/api/favorites Guardar favorito del usuario
router.post('/api/favorites'); // Añadir favorito
//[DELETE] http://localhost:3000/api/favorites Borrar favorito del usuario
router.delete('/api/favorites/:id'); // Quitar favorito


module.exports = router;
