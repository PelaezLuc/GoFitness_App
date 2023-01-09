const getDB = require('../../db/getDB');

const listWorkout = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        //Recogemos datos de la petición
        const { name, type, muscle } = req.query;

        let workouts;

        //Si se manda el filtro name
        if (name) {
            [workouts] = await connection.query(
                `SELECT name, type, muscle_group FROM workout
                WHERE name LIKE ?
                ORDER BY name DESC`[`%${name}%`]
            );
        }

        //Si se filtra por tipo
        if (type) {
            [workouts] = await connection.query(
                `SELECT name, type, muscle_group FROM workout
                WHERE type LIKE ?
                ORDER BY type DESC`[`%${type}%`]
            );
        }

        //Si se filtra por grupo muscular
        if (muscle) {
            [workouts] = await connection.query(
                `SELECT name, type, muscle_group FROM workout
                WHERE muscle_group LIKE ?
                ORDER BY muscle_group DESC`[`%${muscle}%`]
            );
        }

        //Si no se filtra por nada
        if (!name && !muscle && !type) {
            [workouts] = await connection.query(
                `SELECT name, type, muscle_group FROM workout
                ORDER BY name DESC`
            );
        }

        const data = [];

        for (let i = 0; i < workouts.length; i++) {
            data.push({
                ...workouts[i],
            });
        }

        res.send({
            status: 'ok',
            message: 'Lista de ejercicios',
            workouts: data,
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = listWorkout;
