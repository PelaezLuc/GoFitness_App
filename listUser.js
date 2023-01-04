
const getDB = require('./db/getDB');

const listUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const [user] = await connection.query(
            `SELECT * from user`
        );

        const data = [];

        for (let i = 0; i < user.length; i++) {
            data.push({
                ...user[i]
            });
        }


        res.send({
            status: 'Ok',
            message: 'Lista de usuarios: ',
            users: data,
        });



    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = listUser;
