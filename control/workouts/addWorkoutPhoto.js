const getDB = require('../../db/getDB');

const { generateError, savePhoto } = require('../../helpers');

const addWorkoutPhoto = async (req, res, next) => {
    let connection;
    
    try {
        connection = await getDB();
        
        // Destructuramos el id del entrenamiento
        const { idWorkout } = req.params;
        const workoutPhoto = req.workout.photo;
       

        // Comprobamos si el entrenamiento tiene foto
        const [photos] = await connection.query(
            `SELECT photo FROM workout WHERE idWorkout = ?`,
            [idWorkout]
        );

        // Si tiene 1 foto nos devuelve un error
        if (photos.length >= 1) {
            throw generateError(
                'Este producto ya tiene una imagen',
                403
            ); // Forbidden
        }

        // Comprobamos que nos ha enviado una foto nueva para añadir
        if (!req.files || !req.files.workoutPhoto) {
            throw generateError(
                '¡Debes indicar una nueva foto de producto!',
                400
            ); // Bad Request
        }

        // Ejecutamos la funcion savePhoto para guardar en el servidor la nueva foto de producto
        // y guardamos en la variable photoName el nombre de la imagen que devuelve la función
        const photoName = await savePhoto(req.files.workoutPhoto, 1); // 1 -> indica que lo guardamos en static/product

        // Insertamos el nombre de la nueva foto
        await connection.query(
            `INSERT INTO workout (photo)
            VALUES (?)`,
            [photoName]
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
