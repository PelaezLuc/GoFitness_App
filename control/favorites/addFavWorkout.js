const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const addFavWorkout = async (req, res, next) => {
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

        if (like.length > 0) {
            throw generateError(
                'Ya has guardado este ejercicio en favoritos anteriormente!',
                409
            );
        }

        //Añadimos en la bd el fav
        await connection.query(
            `INSERT INTO favorite (id_user, id_workout)
            VALUES(?, ?)`,
            [idUserAuth, idWorkout]
        );

        res.send({
            status: 'OK',
            message: 'Has guardado en favoritos este ejercicio!',
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = addFavWorkout;
