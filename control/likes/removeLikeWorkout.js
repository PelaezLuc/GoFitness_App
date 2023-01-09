const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const deleteLikeWorkout = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        const idUserAuth = req.UserAuth.id;

        const { idWorkout } = req.params;

        //Comprobamos si el usuario le ha dado like ya a ese ejercicio
        const [like] = await connection.query(
            `SELECT * FROM likes WHERE id_user = ? AND id_workout = ?`,
            [idUserAuth, idWorkout]
        );

        if (like.length < 1) {
            throw generateError(
                'No le has dado like a este ejercicio antes!',
                409
            );
        }

        //Eliminamos en la bd el like
        await connection.query(
            `DELETE FROM likes WHERE id_user = ? AND id_workout = ?`,
            [idUserAuth, idWorkout]
        );

        res.send({
            status: 'OK',
            message: 'Like del ejercicio eliminado con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = deleteLikeWorkout;
