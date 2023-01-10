const getDB = require('../../db/getDB');

const listFavWorkout = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const [workouts] = await connection.query(
            `SELECT w.name, w.type, w.muscle_group
            FROM favorite f INNER JOIN workout w
            ON (f.id_workout = w.id)
            WHERE f.id_user = ?`,
            [idUserAuth]
        );

        res.send({
            status: 'ok',
            message: 'Lista de ejercicios favoritos',
            workouts,
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = listFavWorkout;
