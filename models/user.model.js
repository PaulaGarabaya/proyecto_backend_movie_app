const queries = require("../queries/users.queries");
const { executeQuery } = require("../config/db_sql");

const createUser = async (name, surname, email, password, role = 'user') => {
    try {
        const values = [name, surname, email, password, role];
        return await executeQuery(queries.createUsers, values);
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw new Error('Error al crear el usuario');
    }
}

const loginUser = async (name, email, password) => {
    return await executeQuery(queries.loginUsers, [name, email, password]);
}

const logoutUser = async (email, password) => {
    return await executeQuery(queries.logoutUsers, [email])
}

module.exports = {
    createUser,
    loginUser,
    logoutUser
}