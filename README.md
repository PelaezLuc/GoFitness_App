GOFITNESS_APP

Esta api es un sistema de gestión de entrenamientos simulando la creacion de usuarios(existen 2: normal y admin)
y subida de ejercicios por parte del admin pudiendo el usuario casual añadir a favoritos estos ejercicios para
gestionar su entrenamiento.

ENDPOINTS

Users/Usuarios:

POST[/register] -> Registra un nuevo usuario.
POST[/login] -> Login de usuario y devuelve un token.
PUT[/users] -> Edita el emial o el nombre del usuario. Requiere el token.
PUT[/users/password] -> Editar contraseña. Requiere token.

Workouts/Ejercicios:

POST[/addWorkout] -> Añadir ejercicio. Requiere token y "role" de admin.
POST[/addWokoutPhoto/:idWorkout] -> Añadir foto de ejercicio. Requiere token y "role" de admin.
DELETE[/deleteWorkout] -> Elimina un ejercicio. Requiere token y "role" de admin.
GET[/workouts] -> Lista los ejercicios. Requiere token.
GET[/workouts/:idWorkout] -> Ver con detalle un ejercicio. Requiere token.
PUT[/editWorkouts/:idWorkout] -> Editar un ejercicio. Requiere token y "role" de admin.

Likes:

PUT[/workouts/:idWorkout/like] -> Añadir like a un ejercicio. Requiere token.
DELETE[/workouts/:idWorkout/dislike] -> Eliminar like de un ejercicio. Requiere token.

Favoritos:

PUT[/workouts/:idWorkout/fav] -> Añadir un ejercicio a favoritos. Requiere token.
DELETE[/workouts/:idWorkout/quitfav] -> Eliminar un ejercicio de favoritos. Requiere token.
GET[/favworkouts] -> Listar ejercicios favoritos. Requiere token.
