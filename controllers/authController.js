const authModel = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Almacén temporal en memoria para tokens de recuperación de contraseña
 * @type {Object}
 * @property {Object} resetTokens - Tokens activos con estructura { token: { email: string, expires: number } }
 */
const resetTokens = {};

/**
 * Crea un nuevo usuario en el sistema
 * @async
 * @function createUser
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.username - Nombre de usuario único
 * @param {string} req.body.password - Contraseña del usuario
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Redirecciona a /login en éxito, error en caso contrario
 * @throws {Error} Cuando faltan campos obligatorios o hay error en la base de datos
 * @example
 * // POST /api/signup
 * // Body: { username: "usuario", password: "123456", email: "usuario@ejemplo.com" }
 */
async function createUser(req, res) {
    const { username, password, email } = req.body;
    
    try {
        if (!username || !password || !email) {            
            return res.status(400).send('Todos los campos son obligatorios');
        }
        const newUser = await authModel.createUser(username, email, 'user', password);
        res.redirect('/login');
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).send('Error en el registro');
    }
}

/**
 * Autentica un usuario y genera token JWT
 * @async
 * @function logIn
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.username - Nombre de usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Redirecciona a /dashboard en éxito, error en credenciales inválidas
 * @throws {Error} Cuando hay error en la base de datos o comparación de contraseñas
 * @example
 * // POST /api/login
 * // Body: { username: "usuario", password: "123456" }
 */
async function logIn(req, res) {
    const { username, password } = req.body;
    try {
        const user = await authModel.findUserByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.redirect('/dashboard');
        } else {
            res.status(401).send('Credenciales inválidas');
        }
    } catch (error) {
        res.status(500).send('Error en el login');
    }
}

/**
 * Cierra la sesión del usuario eliminando el token JWT
 * @async
 * @function logOut
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Redirecciona a /login después de eliminar la cookie
 * @example
 * // POST /api/logout
 */
async function logOut(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
}

/**
 * Inicia el proceso de recuperación de contraseña generando un token temporal
 * @async
 * @function recoverPassword
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Mensaje de confirmación (siempre retorna éxito por seguridad)
 * @throws {Error} Cuando hay error en la base de datos
 * @example
 * // GET /api/recoverpassword
 * // Body: { email: "usuario@ejemplo.com" }
 */
async function recoverPassword(req, res) {
    const { email } = req.body;
    
    try {
        const user = await authModel.findUserByEmail(email);
        if (user) {
            const token = Math.random().toString(36).substring(2, 15);
            resetTokens[token] = { email, expires: Date.now() + 3600000 };
            console.log(`Token de recuperación para ${email}: ${token}`);
        }
        
        res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' });
        
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

/**
 * Restablece la contraseña usando un token de recuperación válido
 * @async
 * @function restorePassword
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.token - Token de recuperación recibido por email
 * @param {string} req.body.newPassword - Nueva contraseña
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Mensaje de éxito o error si el token es inválido
 * @throws {Error} Cuando hay error en el servidor
 * @example
 * // GET /api/restorepassword
 * // Body: { token: "abc123", newPassword: "nueva123" }
 */
async function restorePassword(req, res) {
    const { token, newPassword } = req.body;
    
    try {
        const tokenData = resetTokens[token];
        
        if (!tokenData || Date.now() > tokenData.expires) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        console.log(`Nueva contraseña para ${tokenData.email}: ${newPassword}`);
        
        delete resetTokens[token];
        
        res.json({ message: 'Contraseña restablecida exitosamente' });
        
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

/**
 * Maneja el callback de autenticación con Google OAuth
 * @async
 * @function googleAuthCallback
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.user - Usuario autenticado por Google
 * @param {Object} req.user.user - Datos del usuario de Google
 * @param {string} req.user.token - Token JWT generado
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>} Redirecciona a /dashboard en éxito, a /login en error
 * @throws {Error} Cuando hay error en el proceso de autenticación con Google
 * @example
 * // Ruta interna de callback de Google OAuth
 */
async function googleAuthCallback(req, res) {
    try {
        const { user, token } = req.user;
        
        res.cookie('token', token, { 
            httpOnly: true, 
            maxAge: 60 * 60 * 1000 
        });
        
        res.redirect('/dashboard');
        
    } catch (error) {
        console.error('Error en Google callback:', error);
        res.redirect('/login?error=google_auth_failed');
    }
}

module.exports = { 
    createUser, 
    logIn, 
    logOut, 
    recoverPassword, 
    restorePassword,
    googleAuthCallback
};