//Login de usuarios

const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginUser = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bd
        connection = await getDB();

        //Obtenemos datos de la bd
        const { email, password } = req.body;

        //Si no recibe el email o el password da error
        if (!email || !password) {
            throw generateError('Tienes que rellenar todos los campos.', 400);
        }

        //Comprobacion de si existe el usuario con el email recibido
        const [user] = await connection.query(
            `SELECT * FROM user WHERE email = ?`,
            [email]
        );

        if (user.length < 1) {
            //si no existe el email lanzamos error
            throw generateError('No existe ningún usuario con ese email.', 404);
        }

        //Comprobación de si la contraseña es correcta
        const validatePassword = await bcrypt.compare(
            password,
            user[0].password
        );

        if (!validatePassword) {
            throw generateError('La contraseña es incorrecta.', 401); //Unauthorized
        }

        //Generamos token

        const tokenInfo = {
            id: user[0].id,
            role: user[0].role,
        };

        console.log(tokenInfo);

        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '2d',
        });

        res.send({
            status: 'OK',
            authToken: token,
            userInfo: tokenInfo,
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = loginUser;
