const getDB = require('../../db/getDB');
const { generateError } = require('../../helpers');
const newWorkoutSchema = require('../schemas/newWorkoutSchema');

const editWorkout = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Recuperamos el id del admin
        const idUserAdmin = req.userAuth.role;

        // Comprobamos acceso
        if (idUserAdmin != 1) {
            throw generateError('Acceso no autorizado', 401);
        }

        await validateSchema(newWorkoutSchema, req.body);

        // Recuperamos el id del entrenamiento de los path params
        const { idWorkout } = req.params;

        // Destructuramos el req.body
        const { name, type, description, muscle_group } = req.body;

        // Si no existe ninguno de los campos a modificar
        if (!name && !type && !description && !muscle_group) {
            throw generateError('¡Si no modificas nada, no toques!', 400); // Bad Request
        }

        // Seleccionamos los datos antiguos del entrenamiento
        const [workout] = await connection.query(
            `SELECT name, type, description, muscle_group FROM workout WHERE id = ?`,
            [idWorkout]
        );

        // Si no devuelve ningún dato
        if (workout.length < 1) {
            throw generateError('¡El producto a modificar no existe!', 404); // Not Found
        }

        // Modificamos los datos del producto
        await connection.query(
            `UPDATE product SET name = ?, type = ?, description = ?, muscle_group = ? WHERE id = ?`,
            [
                name || workout[0].name,
                price || workout[0].type,
                description || workout[0].description,
                muscle_group || workout[0].muscle_group,
                idWorkout,
            ]
        );

        // Respondemos
        res.send({
            status: 'Ok',
            message: '¡Entrenamiento modificado con éxito!',
            workout: {
                name: name || workout[0].name,
                price: price || workout[0].type,
                description: description || workout[0].description,
                mucle_group: muscle_group || workout[0].muscle_group
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editWorkout;

