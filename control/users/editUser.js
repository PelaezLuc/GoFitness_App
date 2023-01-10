const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const editUser = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const { newEmail, newUsername } = req.body;

        //Comprobamos si se han rellenado los campos de la req
        if (!newEmail && !newUsername) {
            throw generateError(
                'No se han indicado los valores a modificar',
                400
            );
        }

        //Comprobamos si existen los nuevos valores en la bd
        const [user] = await connection.query(
            `SELECT * FROM user WHERE email = ? OR name = ?`,
            [newEmail, newUsername]
        );

        if (user.length > 0) {
            throw generateError(
                'El nuevo email o username ya están en uso.',
                409
            );
        }

        const [userOldValues] = await connection.query(
            `SELECT email, name FROM user WHERE id = ?`,
            [idUserAuth]
        );

        await connection.query(
            `UPDATE user SET email = ?, name = ? WHERE id = ?`,
            [
                newEmail || userOldValues[0].email,
                newUsername || userOldValues[0].name,
                idUserAuth,
            ]
        );

        res.send({
            status: 'ok',
            message: `Datos del usuario modificados!`,
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = editUser;
