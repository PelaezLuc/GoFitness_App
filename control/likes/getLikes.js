const getDB = require('../../db/getDB');

const getLikes = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la bbdd
        connection = await getDB();

        const [likes] = await connection.query(
            `SELECT * FROM likes`,
        );

        res.send({
            status: 'OK',
            message: 'Obteniendo los likes...',
            likes: likes,
        });
    } catch (error) {
        next(error);
    } finally {
        //Cerramos conexión con la bbdd
        if (connection) connection.release();
    }
};

module.exports = getLikes;