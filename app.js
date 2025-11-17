const express = require("express");
const cowsay = require("cowsay");
const cookieParser = require('cookie-parser');

const connectDB = require("./config/db_mongo");
const Movie = require("./models/films.model");  

const app = express();
const port = 3000;

require("dotenv").config();


// Habilitar recepción de JSON por mi backend
// Parsear el body entrante a JSON
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos del front CSS, JS, assets

// Middlewares
app.use(cookieParser());
const error404 = require("./middlewares/error404");
const morgan = require("./middlewares/morgan");
app.use(morgan(':method :url :status :param[id] - :response-time ms :body'));

// Configuración PUG
app.set('view engine', 'pug');
app.set('views','./views');

app.use(express.json());
app.use(express.static('public'));

// Rutas
const viewsRoutes = require("./routes/viewsRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
// const filmsRoutes = require("./routes/filmsRoutes");    
// const userRoutes = require("./routes/userRoutes");      
// const authRoutes = require("./routes/authRoutes");     

// API
app.use('/', viewsRoutes);
app.use('/', favoritesRoutes); 
// app.use('/', filmsRoutes);    
// app.use('/', userRoutes);     
// app.use('/', authRoutes);    

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe en este servidor` 
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error global:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: error.message 
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(
    cowsay.say({
      text: `Endpoint Proyecto Movie App http://localhost:${port}`,
      f: "owl", 
    })
  );
});

connectDB();
module.exports = app;