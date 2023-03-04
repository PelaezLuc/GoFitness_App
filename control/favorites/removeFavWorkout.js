const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const removeFavWorkout = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const { idWorkout } = req.params;

        //Comprobamos si el usuario le ha dado fav ya a ese ejercicio
        const [like] = await connection.query(
            `SELECT * FROM favorite WHERE id_user = ? AND id_workout = ?`,
            [idUserAuth, idWorkout]
        );

        if (like.length < 1) {
            throw generateError('No has guardado este ejercicio antes!', 409);
        }

        //Eliminamos en la bd el fav
        await connection.query(
            `DELETE FROM favorite WHERE id_user = ? AND id_workout = ?`,
            [idUserAuth, idWorkout]
        );

        const [[count]] = await connection.query(
            'SELECT COUNT(id_favorite) as favorite FROM favorite WHERE id_workout=?',
            [idWorkout]
        );

        res.send({
            status: 'OK',
            message: 'Ejercicio eliminado de favoritos con éxito!',
            data: count.favorite,
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = removeFavWorkout;
