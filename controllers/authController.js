const authService = require('../services/authServices');

async function createUser(req, res) {
    try {
        await authService.createUser(req.body.username, req.body.email, req.body.password);
        res.redirect('/login');
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
}

async function logIn(req, res) {
    try {
        const { user, token } = await authService.logIn(req.body.username, req.body.password);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    } catch (error) {
        res.status(error.status || 500).send(error.message);
    }
}

async function logOut(req, res) {
    authService.logOut();
    res.clearCookie('token');
    res.redirect('/login');
}

async function recoverPassword(req, res) {
    try {
        await authService.recoverPassword(req.body.email);
        res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
}

async function restorePassword(req, res) {
    try {
        await authService.restorePassword(req.body.token, req.body.newPassword);
        res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
}

async function googleAuthCallback(req, res) {
    try {
        const { user, token } = await authService.googleAuthCallback(req.user);
        res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
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

/***************ANTES DEL SERVICE******************/
// const authModel = require('../models/authModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const authServices = require('../services/authServices')

// const resetTokens = {};

// //[POST] http://localhost:3000/api/signup
// async function createUser(req, res) {
//     const { username, password, email } = req.body;
    
//     try {
//         if (!username || !password || !email) {            
//             return res.status(400).send('Todos los campos son obligatorios');
//         }
//         const newUser = await authModel.createUser(username, email, 'user', password);
//         res.redirect('/login');
//     } catch (error) {
//         console.error('Error en el registro:', error);
//         res.status(500).send('Error en el registro');
//     }
// }

// //[POST] http://localhost:3000/api/login
// async function logIn(req, res) {
//     const { username, password } = req.body;
//     try {
//         const user = await authModel.findUserByUsername(username);
//         if (user && await bcrypt.compare(password, user.password)) {
//             const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//             res.cookie('token', token, { httpOnly: true });
//             res.redirect('/dashboard');
//         } else {
//             res.status(401).send('Credenciales inválidas');
//         }
//     } catch (error) {
//         res.status(500).send('Error en el login');
//     }
// }

// //[POST] http://localhost:3000/api/logout
// async function logOut(req, res) {
//     res.clearCookie('token');
//     res.redirect('/login');
// }

// //[GET] http://localhost:3000/api/recoverpassword
// async function recoverPassword(req, res) {
//     const { email } = req.body;
    
//     try {
//         const user = await authModel.findUserByEmail(email);
//         if (user) {
//             const token = Math.random().toString(36).substring(2, 15);
//             resetTokens[token] = { email, expires: Date.now() + 3600000 };
//             console.log(`Token de recuperación para ${email}: ${token}`);
//         }
        
//         res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' });
        
//     } catch (error) {
//         res.status(500).json({ error: 'Error del servidor' });
//     }
// }

// //[GET] http://localhost:3000/api/restorepassword
// async function restorePassword(req, res) {
//     const { token, newPassword } = req.body;
    
//     try {
//         const tokenData = resetTokens[token];
        
//         if (!tokenData || Date.now() > tokenData.expires) {
//             return res.status(400).json({ error: 'Token inválido o expirado' });
//         }

//         console.log(`Nueva contraseña para ${tokenData.email}: ${newPassword}`);
        
//         delete resetTokens[token];
        
//         res.json({ message: 'Contraseña restablecida exitosamente' });
        
//     } catch (error) {
//         res.status(500).json({ error: 'Error del servidor' });
//     }
// }

// //[GOOGLE OAUTH] Callback de Google
// async function googleAuthCallback(req, res) {
//     try {
//         const { user, token } = req.user;
        
//         res.cookie('token', token, { 
//             httpOnly: true, 
//             maxAge: 60 * 60 * 1000 
//         });
        
//         res.redirect('/dashboard');
        
//     } catch (error) {
//         console.error('Error en Google callback:', error);
//         res.redirect('/login?error=google_auth_failed');
//     }
// }

// module.exports = { 
//     createUser, 
//     logIn, 
//     logOut, 
//     recoverPassword, 
//     restorePassword,
//     googleAuthCallback
// };


// const authModel = require("../models/authModels");
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// // POST http://localhost:3000/api/signup
// const createUser = async (req, res) => {
//     try {
//         const { name, surname, email, password, role = "user" } = req.body;
//         console.log("BODY RECIBIDO:", req.body);
//         if(!name || !surname || !email || !password || !role) {
//             return res.status(400).json({ message: "Faltan campos por rellenar"});
//         }

//         const newUser = await authModel.createUser(name, surname, email, password, role);
//         console.log("USUARIO CREADO:", newUser);
//         res.status(201).json({
//             message: "Usuario creado correctamente",
//             user: newUser
//         })
//     } catch (error) {
//         res.status(500).json({ message: "Error en el servidor", error});
//     }
// }

// // POST http://localhost:3000/api/login
// const logIn = async (req, res) => {
//     const { name, email, password } = req.body;
//     try {

//         if(!name || !email || !password) {
//             return res.status(400).json({ message: "Faltan campos por rellenar"});
//         }
//         const userLogin = await authModel.logInModel(name, email, password);
//             res.status(201).json({
//             message: "Login correcto",
//             user: userLogin
//         })
//     } catch (error) {
//         res.status(500).json({ message: "Error en el servidor", error});
//     }
// }

// const logOut = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//             if(!email || !password) {
//             return res.status(400).json({ message: "Faltan campos por rellenar"});
//             }

//             const userLogout = await authModel.logOutModel(email, password);
//             res.status(201).json({
//             message: "Logout correcto",
//             email: userLogout.email,
//             password: userLogout.password
//             })
//     } catch (error) {
//         res.status(500).json({ message: "Error en el servidor", error});
//     }
// }

// const recoverPassword = async (req, res) => {
//     try {
//         const { email } = req.body;

//         if(!email) {
//             return res.status(400).json({ message: "Faltan campos por rellenar"});
//         }

//         const userRecoverPassword = await authModel.getUserModel(email);
//             res.status(201).json({
//             message: "Contraseña:",
//             id: userRecoverPassword.id,
//             email: userRecoverPassword.email,
//             password: userRecoverPassword.password
//             })
//     } catch (error) {
//         res.status(500).json({ message: "Error en el servidor", error});
//     }
// }

// module.exports = {
//     createUser,
//     logIn,
//     logOut,
//     recoverPassword
// }

