const getDB = require('../../db/getDB');

const seeWorkout = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        //Recuperamos el id del workout
        const { idWorkout } = req.params;

        const [workout] = await connection.query(
            `SELECT name, type, description, muscle_group, photo FROM workout WHERE id = ?`,
            [idWorkout]
        );

        res.send({
            status: 'OK',
            message: 'Viendo el ejercicio...',
            workout: workout,
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = seeWorkout;
