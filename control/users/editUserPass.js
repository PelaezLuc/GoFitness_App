const getDB = require('../../db/getDB');
const bcrypt = require('bcrypt');
const { generateError } = require('../../helpers');

let saltRounds = 10;

const editUserPass = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const { email, newPassword, confirmNewPassword } = req.body;

        //Comprobamos si ha rellenado todos los campos
        if (!email || !newPassword || !confirmNewPassword) {
            throw generateError('Faltan por rellenar datos obligatorios.', 400);
        }

        //Comprobamos si las contraseñas coinciden
        if (newPassword !== confirmNewPassword) {
            throw generateError('Las contraseñas no coinciden', 401);
        }

        //Comprobamos si el email es el mismo con el que se ha logueado
        const [user] = await connection.query(
            `SELECT email FROM user WHERE id = ?`,
            [idUserAuth]
        );

        if (email !== user[0].email) {
            throw generateError(
                'El email debe de ser el mismo que con el que se ha logueado.',
                401
            );
        }

        //Encriptamos contraseña
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        /*
        //Comprobamos si la contraseña nueva es igual a la anterior
        const [oldPass] = await connection.query(
            `SELECT password FROM user WHERE id = ?`,
            [idUserAuth]
        );

        if (oldPass === hashedPassword) {
            throw generateError(
                'La nueva contraseña no puede ser igual que la anterior.',
                401
            );
        }
        */

        //Cambiamos los valores de la contraseña en la bd
        await connection.query(`UPDATE user SET password = ? WHERE id = ?`, [
            hashedPassword,
            idUserAuth,
        ]);

        res.send({
            status: 'OK',
            message: 'Contraseña cambiada con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = editUserPass;
