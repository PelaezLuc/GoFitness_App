const getDB = require('../../db/getDB');

const listWorkout = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        console.log(connection);

        //Recogemos datos de la petición
        const { name, type, muscle } = req.query;

        const idUser = [req.userAuth.id];

        let mySQLQuery = `
            SELECT 
                w.id, 
                w.name, 
                w.type, 
                w.description, 
                w.muscle_group, 
                w.photo, 
                COUNT(l.id_likes) likes,
                COUNT(f.id_favorite) favs,
                (SELECT COUNT(likes.id_likes) from likes WHERE likes.id_workout=w.id AND likes.id_user=${idUser}) AS userLike,
                (SELECT COUNT(favorite.id_favorite) from favorite WHERE favorite.id_workout=w.id AND favorite.id_user=${idUser}) AS userFav
            FROM workout AS w 
            LEFT JOIN likes AS l ON w.id = l.id_workout
            LEFT JOIN favorite AS f ON w.id = f.id_workout
            `;

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
