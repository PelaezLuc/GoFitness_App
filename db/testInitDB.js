
const main = require('./initDB')

const testDB = async () => {
    // Declaramos un pool de conexiones
    let pool;

    try {
        if (!pool) {
            // Creamos un grupo de conexiones
            return pool = main();

            // Ejecutamos el método getConnection para devolver una conexion libre
        }
    } catch (error) {
        console.error(error.message);
    }
};

testDB();

// Exportamos la funcion getDB
module.exports = testDB;