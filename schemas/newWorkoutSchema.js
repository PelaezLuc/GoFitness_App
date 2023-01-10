const Joi = require('joi');

const newWorkoutSchema = Joi.object().keys({
    
    name: Joi.string()
        .required()
        .min(3)
        .max(30)
        .regex(/[A-Za-z0-9]/)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El nombre es requerido!');
            } else {
                return new Error(
                    '¡El nombre debe tener entre 3 y 30 caracteres de longitud!'
                );
            }
        }),
    type: Joi.string()
        .required()
        .min(5)
        .max(15)
        .error((errors) => {
            if (
                errors[0].code === 'any.required' ||
                errors[0].code === 'string.empty'
            ) {
                return new Error('¡El tipo de ejercicio es una propiedad obligatoria!');
            } else {
                return new Error(
                    '¡El tipo de ejercicio debe ser aeróbico o anaeróbico!'
                );
            }
        }),
    description: Joi.string()
        .min(5)
        .max(500)
        .error((errors) => {
            if (errors[0].code === 'string.empty') {
                return new Error(
                    '¡No se permite enviar una descripción vacía!'
                );
            } else {
                return new Error(
                    '¡La descripción debe tener entre 3 y 500 caracteres como máximo!'
                );
            }
        }),
    
    muscle_group: Joi.string()
    .min(5)
    .max(30)
    .error((errors) => {
        if (errors[0].code === 'string.empty') {
            return new Error(
                '¡No se permite enviar una descripción vacía!'
            );
        } else {
            return new Error(
                '¡La descripción debe tener entre 3 y 500 caracteres como máximo!'
            );
        }
    }),

});

module.exports = newWorkoutSchema;

