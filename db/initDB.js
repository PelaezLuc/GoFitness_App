const getDB = require('./getDB');

async function main() {
    // Creamos una variable para guardar la conexión
    let connection;

    try {
        // Abrimos la conexion a la bbdd
        connection = await getDB();

        console.log('Eliminando tablas en caso que existan...');

        await connection.query(`DROP TABLE IF EXISTS likes`);
        await connection.query(`DROP TABLE IF EXISTS favorite`);
        await connection.query(`DROP TABLE IF EXISTS workout`);
        await connection.query(`DROP TABLE IF EXISTS user`);

        console.log('¡Tablas eliminadas!');

        console.log('Creando tablas...');

        await connection.query(
            `CREATE TABLE IF NOT EXISTS user (
                id int not null primary key auto_increment,
                name varchar(50) not null,
                email varchar(100) not null,
                password varchar(20) not null,
                role bool default(0) not null 
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS workout (
                id int not null primary key auto_increment,
                name varchar(50) not null,
                type varchar(50) not null,
                description text not null,
                muscle_group varchar(50) not null,
                photo varchar(255)
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS likes(
                id_likes int not null primary key auto_increment,
                id_user int not null,
	            foreign key (id_user) references user(id),
                id_workout int not null,
	            foreign key (id_workout) references user(id)
            )`
        );

        await connection.query(
            `CREATE TABLE IF NOT EXISTS favorite(
                id_favorite int not null primary key auto_increment,
                id_user int not null,
	            foreign key (id_user) references user(id),
                id_workout int not null,
	            foreign key (id_workout) references user(id)
            )`
        );

        console.log('¡Tablas creadas!');

        console.log('Insertando unos datos de prueba...');

        await connection.query(
            `INSERT INTO user (name, email, password, role)
            VALUES ('Lucas', 'lucas@gmail.com', '123', 0), ('Daniel', 'daniel@email.com', '321', 0), 
            ('Vadym', 'vadym@gmail.com', '777', 1)`
        );

        await connection.query(
            `INSERT INTO workout(name, type, description, muscle_group, photo)
            VALUES ('press banca', 'anaeróbico', 'levantamiento de barra a la altura del pecho', 'pectoral', '0'),
            ('dominadas', 'anaeróbico','colgado de brazos levantar el propio peso hasta superar la barra', 'espalda/biceps', '1'),
            ('sentadilla en barra', 'anaeróbico', 'realizar sentadilla con peso tras nuca', 'piernas', '2')`
        );

        console.log('¡Datos de prueba insertados con éxito!');
    } catch (error) {
        console.error(error.message);
    } finally {
        // Si existe una conexion a la base de datos, nos desconectamos
        if (connection) connection.release();
        process.exit();
    }
}

// Ejecutamos la funcion main
module.exports = main;