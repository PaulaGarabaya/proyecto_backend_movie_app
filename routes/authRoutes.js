// para el acceso al sistema
const express = require('express');
const router = express.Router();
const userController = require("../controllers/auth.controller");



//------------- WEB -------------


// -------------API--------------
//[POST] http://localhost:3000/api/signup Registrar usuario en la aplicación
router.post('/api/signup', userController.signup);
//[POST] http://localhost:3000/api/login Hacer login en la aplicación
// router.post('/api/login', userController.login);
//[POST] http://localhost:3000/api/logout Salir
// router.post('/api/logout');
//[GET] http://localhost:3000/api/recoverpassword Recuperar password
// router.get('/api/recoverpassword');
//[GET] http://localhost:3000/api/restorepassword Cambiar password
// router.get('/api/restorepassword');


module.exports = router;
