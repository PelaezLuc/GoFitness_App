const express = require('express');
const morgan = require('morgan');
require('dotenv').config;

// Creamos el servidor
const app = express();

//Deserializar el body en formato raw
app.use(express.json());

//Middleware para Morgan
app.use(morgan('dev'));

/* 
###################
### Middlewares ###
###################
*/

const isAuth = require('./middlewares/isAuth');
const isAdmin = require('./middlewares/isAdmin');

/* 
########################
### Control Usuarios ###
########################
*/

const registerUser = require('./control/users/registerUser');
const loginUser = require('./control/users/loginUser');
const editUser = require('./control/users/editUser');
const editUserPass = require('./control/users/editUserPass');

/* 
##########################
### Endpoints Usuarios ###
##########################
*/

//Registro de usuarios
app.post('/register', registerUser);

//Login de usuarios
app.post('/login', loginUser);

//Editar email o name
app.put('/users', isAuth, editUser);

//Editar password
app.put('/users/password', isAuth, editUserPass);

/* 
########################
### Control Workouts ###
########################
*/

const listWorkout = require('./control/workouts/listWorkout');
const seeWorkout = require('./control/workouts/seeWorkout');

/* 
##########################
### Endpoints Workouts ###
##########################
*/

//Listar ejercicios
app.get('/Workouts', isAuth, listWorkout);

//Ver más de un ejercicio
app.get('/Workouts/:idWorkout', isAuth, seeWorkout);

/* 
#####################
### Control likes ###
#####################
*/

const addLikeWorkout = require('./control/likes/addLikeWorkout');
const removeLikeWorkout = require('./control/likes/removeLikeWorkout');
const seeWorkout = require('./control/workouts/seeWorkout');

/* 
#######################
### Endpoints Likes ###
#######################
*/

//Añadir like a un workout
app.post('/workouts/:idWorkout/like', isAuth, addLikeWorkout);
//Quitar like a un workout
app.post('/workouts/:idWorkout/like', isAuth, removeLikeWorkout);

/* 
    ########################################
    ### Middlewares de Error y Not Found ###
    ########################################
*/

// Middleware de Error
app.use((error, req, res, _) => {
    console.error(error);

    // Establecemos el codigo del error
    res.status(error.httpStatus || 500);

    // Respondemos
    res.send({
        status: 'Error',
        message: error.message,
    });
});

// Middleware de Not Found
app.use((req, res) => {
    // Establecemos el codigo de error 404
    res.status(404);

    // Respondemos
    res.send({
        status: 'Error',
        message: 'Not found',
    });
});

// Ponemos el servidor a la escucha
app.listen(4000, () => {
    console.log(`Server listening at http://localhost:4000`);
});
