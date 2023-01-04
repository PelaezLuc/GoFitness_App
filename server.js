const express = require('express');
const listUser = require('./listUser');
const testInitDB = require('./db/testInitDB');

// Creamos el servidor
const app = express();

/* 
##########################
### Endpoints Usuarios ###
##########################
*/


app.get('/testInitDB', testInitDB);
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
