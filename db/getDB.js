const mysql = require('mysql2/promise');
require('dotenv').config();

//recogemos variables del archivo .env
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

// Declaramos un pool de conexiones
let pool;

const getDB = async () => {
    try {
        if (!pool) {
            // Creamos un grupo de conexiones
            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASSWORD,
                database: MYSQL_DATABASE,
                timezone: 'Z',
            });
        }

        // Ejecutamos el método getConnection para devolver una conexion libre
        return await pool.getConnection();
    } catch (error) {
        console.error(error.message);
    }
};

// Exportamos la funcion getDB
module.exports = getDB;
