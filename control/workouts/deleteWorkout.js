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
            `SELECT photo FROM workout WHERE id = ?`,
            [idWorkout]
        );

        //Eliminamos la foto del entrenamiento del servidor
        if (photo.photo) {
            await deletePhoto(photo.photo);
        }

        // Una vez eliminadas la foto, eliminamos el entrenamiento
        await connection.query(`DELETE FROM workout WHERE id = ?`, [idWorkout]);

        res.send({
            status: 'Ok',
            message: '¡Entrenamiento eliminado con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteWorkout;
