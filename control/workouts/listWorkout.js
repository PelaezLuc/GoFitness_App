const getDB = require('../../db/getDB');

const listWorkout = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        //Recogemos datos de la petición
        const { name, type, muscle } = req.query;

        let mySQLQuery = `SELECT w.name, w.type, w.muscle_group, COUNT(l.id_likes) likes FROM workout w LEFT JOIN likes l ON w.id = l.id_workout`;

        const values = [];

        let clause = `WHERE`;

        //Si se manda el filtro name
        if (name) {
            mySQLQuery += ` ${clause} w.name LIKE ?`;
            values.push(`%${name}%`);
            clause = `AND`;
        }

        //Si se filtra por tipo
        if (type) {
            mySQLQuery += ` ${clause} w.type LIKE ?`;
            values.push(`%${type}%`);
            clause = `AND`;
        }

        //Si se filtra por grupo muscular
        if (muscle) {
            mySQLQuery += ` ${clause} w.muscle_group LIKE ?`;
            values.push(`%${muscle}%`);
        }

        mySQLQuery += ` GROUP BY w.id ORDER BY likes DESC`;

        const [workouts] = await connection.query(mySQLQuery, values);

        res.send({
            status: 'ok',
            message: 'Lista de ejercicios',
            workouts,
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = listWorkout;
