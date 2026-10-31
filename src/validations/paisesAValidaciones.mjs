import { body } from 'express-validator'

const textoRequerido = (campo, etiqueta, max = 200) =>
  body(campo)
    .isString()
    .withMessage(`${etiqueta} debe ser texto`)
    .bail()
    .trim()
    .notEmpty()
    .withMessage(`${etiqueta} es requerido`)
    .isLength({ min: 1, max })
    .withMessage(`${etiqueta} debe tener hasta ${max} caracteres`)

export const paisesAValidations = [
  textoRequerido('nombreOficial', 'El nombre oficial', 90),
  textoRequerido('capital', 'La capital', 200),
  textoRequerido('languages', 'El idioma'),
  body('borders')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Los países limítrofes deben ser texto con códigos separados por coma o espacio')
    .bail()
    .matches(/^([A-Z]{3})(([,\s]+[A-Z]{3})*)$/)
    .withMessage('Cada país limítrofe debe tener un código de 3 letras mayúsculas'),
  body('area')
    .isInt({ min: 0 })
    .withMessage('El área debe ser un número entero igual o mayor que cero'),
  body('image').optional({ checkFalsy: true }).isString().withMessage('La imagen debe ser texto'),
]