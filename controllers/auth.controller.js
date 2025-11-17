const createUser  = require("../models/user.model");
const queries = require("../queries/users.queries")

// POST http://localhost:3000/api/signup
const signup = async (req, res) => {
    console.log(req.body);
    try {
        const { name, surname, email, password, role = 'user' } = req.body;

        if(!name || !surname || !email || !password) {
            console.log(name, surname, email, password);
            return res.status(400).json({ message: "Todos los campos son obligatorios"});
        }

        const user = await queries(name, surname, email, password, role);
        // res.redirect('/login')
        // res.status(201).json({ message: "Usuario creado", user });
        
    } catch (error) {
        console.error('Error en el registro:', error.message);
        res.status(500).send('Error en el registro');
    }
}

// POST http://localhost:3000/api/login
const login = async (req, res) => {
    console.log(req.body);
    try {
        const {name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ message: "Campo erróneo"});
        }

        const userLogin = await User.userLogin(name, email, password);
        console.log(userLogin);
        res.status(201).json({ message: "Has iniciado sesión correctamente", userLogin});
    } catch (err) {
        res.status(400).json({ message: 'Algo ha salido mal al logearte', err});
    }
}

// POST http://localhost:3000/api/logout
const logout = async (req, res) => {
    console.log(req.body);
    try {
        const {email, password} = req.body;
        
        if(!email || !password) {
            return res.status(400).json({ message: "Introduce los campos correctamente por favor."})
        };

        // Buscar Usuario
        const user = await User.logoutUser(email);
        if(!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Comparar contraseña
        if(password !== user.password) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const resultUser = await User.logoutUsers(email);
        console.log(resultUser)

        return res.status(200).json({ message: "Sesión cerrada correctamente", resultUser });

    } catch(error) {
        console.error('Error en el registro:', error.message);
        res.status(500).send('Error en el registro');
    }
}

module.exports = {
    signup,
    login,
    logout
}