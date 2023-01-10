const { unlink } = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');

const workoutDir = path.join(__dirname, 'static', 'workout');

//Función que genera un error
function generateError(message, code) {
    const error = new Error(message);
    error.httpStatus = code;
    return error;
}

// Funcion que elimina una imagen del servidor
async function deletePhoto(photoName) {
    try {
        // Variable que va a guardar la ruta absoluta a la imagen que hay que borrar
        let photoPath;

        photoPath = path.join(workoutDir, photoName);
        // Una vez tenemos la ruta absoluta hacia la imagen creada, la eliminamos
        await unlink(photoPath);
    } catch (error) {
        throw new Error('¡Error al procesar la imagen del servidor!');
    }
}

// Funcion que guarda una nueva foto en el servidor y devuelve un nombre único para la imagen
async function savePhoto(image) {
    try {
        // Convertimos la imagen recibida en un objeto sharp
        const sharpImage = sharp(image.data);

        // Generamos un nombre único para la imagen
        const imageName = uuid.v4() + '.jpg';

        const photoPath = path.join(workoutDir, imageName);

        // Guardamos la imagen
        sharpImage.toFile(photoPath);

        // Devolvemos el nombre de imagen generado
        return imageName;
    } catch (error) {
        throw new Error('¡Ha ocurrido un error al procesar la imagen!');
    }
}

async function validateSchema(schema, data) {
    try {
        // Intenta validar los datos con el schema que pasemos por argumento
        await schema.validateAsync(data);
    } catch (error) {
        // Si se captura algun error que surja en el schema, se asigna el codigo 400 de error
        error.httpStatus = 400; // Bad Request
        throw error;
    }
}

module.exports = {
    generateError,
    deletePhoto,
    savePhoto,
    validateSchema,
};
