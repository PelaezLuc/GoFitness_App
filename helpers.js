//Función que genera un error
function generateError(message, code) {
    const error = new Error(message);
    error.httpStatus = code; //Mala petición
    return error;
}

module.exports = {
    generateError,
};
