const getDB = require('../db/getDB');
const { generateError } = require('../helpers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAdmin = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        const { authorization } = req.headers;

        let tokenInfo;

        try {
            //Desencriptar token
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            throw generateError('Token no válido', 401);
        }

        //Comprobar que el rol del usuario es 1(admin)
        if (tokenInfo.role !== 1) {
            throw generateError('Este usuario no es admin', 401);
        }

        req.userAdmin = tokenInfo;

        next();
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = isAdmin;
