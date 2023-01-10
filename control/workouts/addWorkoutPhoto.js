const getDB = require('../../db/getDB');

const { generateError, savePhoto, deletePhoto } = require('../../helpers');

const addWorkoutPhoto = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Destructuramos el id del entrenamiento
        const { idWorkout } = req.params;

        // Comprobamos si el entrenamiento tiene foto
        const [[workout]] = await connection.query(
            `SELECT photo FROM workout WHERE id = ?`,
            [idWorkout]
        );

        // Si tiene 1 foto la elimina
        if (workout.photo) {
            await deletePhoto(workout.photo);
        }

        // Comprobamos que nos ha enviado una foto nueva para añadir
        if (!req.files || !req.files.workoutPhoto) {
            throw generateError(
                '¡Debes indicar una nueva foto de producto!',
                400
            ); // Bad Request
        }

        // Ejecutamos la funcion savePhoto para guardar en el servidor la nueva foto del entrenamiento
        // y guardamos en la variable photoName el nombre de la imagen que devuelve la función
        const photoName = await savePhoto(req.files.workoutPhoto);

        // Insertamos el nombre de la nueva foto
        await connection.query(
            `UPDATE workout SET photo = ?
            WHERE id = ?`,
            [photoName, idWorkout]
        );

        // Respondemos
        res.send({
            status: 'Ok',
            message: '¡Foto de entrenamiento añadida con éxito!',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = addWorkoutPhoto;
