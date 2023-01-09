const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');

const addLikeWorkout = async (req, res, next) => {
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

        if (like.length > 0) {
            throw generateError(
                'Ya le has dado a like a este ejercicio anteriormente!',
                409
            );
        }

        //Añadimos en la bd el like
        await connection.query(
            `INSERT INTO likes (id_user, id_workout)
            VALUES(?, ?)`,
            [idUserAuth, idWorkout]
        );

        res.send({
            status: 'OK',
            message: 'Le has dado like al ejercicio!',
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = addLikeWorkout;
