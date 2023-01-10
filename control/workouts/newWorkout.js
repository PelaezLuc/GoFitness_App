const getDB = require('../../db/getDB');

const { generateError } = require('../../helpers');

const newWorkout = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Destructuramos los datos del entrenamiento del cuerpo de la peticion
        const { name, type, description, muscle_group } = req.body;

        // Recuperamos el id del admin
        const idUserAdmin = req.userAuth.role;

        if (idUserAdmin != 1) {
            throw generateError('Acceso no autorizado', 401);
        }

        if (!name || !type || !description || !muscle_group) {
            throw generateError('Faltan datos obligatorios.', 409);
        }

        const [workoutName] = await connection.query(
            `SELECT id FROM workout WHERE name = ?`,
            [name]
        );

        if (workoutName.length > 0) {
            throw generateError(
                'Ya existe un entrenamiento con este nombre',
                409
            );
        }

        //*************************************//
        //*******FALTA CHECK DEL SCHEMA********//
        //*************************************//

        await connection.query(
            `
            INSERT INTO workout(name, type, description, muscle_group)
            VALUES (?, ?, ?, ?)
        `,
            [name, type, description, muscle_group]
        );

        // Si se inserta correctamente
        res.send({
            status: 'Ok',
            message: '¡Workout creado correctamente!',
            data: {
                name,
                type,
                description,
                muscle_group,
            },
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newWorkout;
