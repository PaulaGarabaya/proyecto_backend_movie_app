const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require('passport');

//[POST] http://localhost:3000/api/signup Registrar usuario en la aplicación
router.post('/api/signup', authController.createUser);

//[POST] http://localhost:3000/api/login Hacer login en la aplicación
router.post('/api/login', authController.logIn);

//[POST] http://localhost:3000/api/logout Salir
router.post('/api/logout', authController.logOut);

//[GET] http://localhost:3000/api/recoverpassword Recuperar password
router.get('/api/recoverpassword', authController.recoverPassword);

//[GET] http://localhost:3000/api/restorepassword Cambiar password
router.get('/api/restorepassword', authController.restorePassword);

//[GOOGLE OAUTH] Rutas de Google
router.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    authController.googleAuthCallback
);

module.exports = router;