const express = require('express');
const listUser = require('./listUser');
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

//const isAuth = require('./middleware/isAuth');

/* 
########################
### Control Usuarios ###
########################
*/

//Registro de usuarios
const registerUser = require('./control/users/registerUser');

const loginUser = require('./control/users/loginUser');

/* 
##########################
### Endpoints Usuarios ###
##########################
*/

//Registro de usuarios
app.post('/register', registerUser);

//Login de usuarios
app.post('/login', loginUser);

app.get('/listUser', listUser);

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
