

const mysql = require('mysql2/promise');

const getDB = async () => {
    // Declaramos un pool de conexiones
    let pool;

    try {
        if (!pool) {
            // Creamos un grupo de conexiones
            pool = mysql.createPool({
                connectionLimit: 10,
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'go_fitness',
                timezone: 'Z',
            });

            // Ejecutamos el método getConnection para devolver una conexion libre
            return await pool.getConnection();
        }
    } catch (error) {
        console.error(error.message);
    }
};

// Exportamos la funcion getDB
module.exports = getDB;
