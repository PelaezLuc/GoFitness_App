const getDB = require('../../db/getDB');

const listFavWorkout = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        const idUserAuth = req.userAuth.id;

        const [workouts] = await connection.query(
            `SELECT 
            w.id, 
            w.name, 
            w.type, 
            w.description, 
            w.muscle_group, 
            w.photo,
            COUNT(l.id_likes) likes,
            COUNT(f.id_favorite) favorite,
            (SELECT COUNT(likes.id_likes) from likes WHERE likes.id_workout=w.id AND likes.id_user=${idUserAuth}) AS userLike,
            (SELECT COUNT(favorite.id_favorite) from favorite WHERE favorite.id_workout=w.id AND favorite.id_user=${idUserAuth}) AS userFav
            FROM favorite f 
            INNER JOIN workout w ON (f.id_workout = w.id)
            LEFT JOIN likes AS l ON w.id = l.id_workout
            WHERE f.id_user = ?
            GROUP BY w.id ORDER BY likes DESC`,
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
