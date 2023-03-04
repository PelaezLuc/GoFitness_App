//Registrar Usuario nuevo

const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const bcrypt = require('bcrypt');

let saltRounds = 10;

const registerUser = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        let { name, email, password } = req.body;

        //Comprobación de si están rellenados todos los campos
        if (!name || !email || !password) {
            //Enviamos error
            throw generateError('Faltan datos obligatorios.', 400); // Mala petición
        }

        //Comprobamos si el email está siendo usado ya
        const [userEmail] = await connection.query(
            `SELECT id FROM user WHERE email = ?`,
            [email]
        );

        if (userEmail.length > 0) {
            //si email existe lanzamos error
            throw generateError(
                'Ya existe un usuario registrado con ese email en la bd',
                409
            );
        }

        //Comprobamos si el nombre del usuario está registrado ya
        const [userName] = await connection.query(
            `SELECT id FROM user WHERE name = ?`,
            [name]
        );

        if (userName.length > 0) {
            //si email existe lanzamos error
            throw generateError(
                'Ya existe un usuario registrado con ese email en la bd',
                409
            );
        }

        //Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log(hashedPassword.length);

        //Guardamos datos del usuario en la bd
        await connection.query(
            `INSERT INTO user (name, email, password)
            VALUES (?, ?, ?)`,
            [name, email, hashedPassword]
        );

        res.send({
            status: 'OK',
            message: 'Usuario registrado con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = registerUser;
