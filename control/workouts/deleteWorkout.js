const getDB = require('../../db/getDB');
const { deletePhoto } = require('../../helpers');

const deleteWorkout = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Destructuramos el id del entrenamiento
        const { idWorkout } = req.params;

        // Primero comprobamos que el entrenamiento tiene fotos asignadas
        const [photo] = await connection.query(
            `SELECT photo FROM workout WHERE idProduct = ?`,
            [idWorkout]
        );

        //Eliminamos la foto del entrenamiento servidor
        await deletePhoto(photo, 1); 

        // Eliminamos la foto del entrenamiento en la base de datos
        await connection.query(
            `DELETE photo FROM workout WHERE idWorkout = ?`,
            [idWorkout]
        );

        // Una vez eliminadas la foto, eliminamos el entrenamiento
        await connection.query(`DELETE * FROM workout WHERE id = ?`, [idWorkout]);

        res.send({
            status: 'Ok',
            message: 'Workout eliminado con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteWorkout;

