import { body, validationResult } from 'express-validator'
import ResponseBuilder from '../utils/builders/responseBuilder.js'


export const validateEmail = [
    body('email')
        .isEmail().withMessage('Formato de correo inválido')
]
export const validatePassword = [
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula')
        .matches(/[@$!%*?&_.-]/).withMessage('La contraseña debe contener al menos un carácter especial')
]

export const validateName = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
]

export const validateWorkspaceName = [
    body('workspaceName')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 8 }).withMessage('El nombre debe tener al menos 8 caracteres')
]

export const validateChannelName = [
    body('channelName')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 8 }).withMessage('El nombre debe tener al menos 8 caracteres')
]

export const validateMessageContent = [
    body('content')
    .notEmpty().withMessage('El contenido del mensaje no puede estar vacio')
    .isLength({min: 1}).withMessage('El contenido del mensaje debe tener al menos un caracter')
]

export const handleErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setMessage('Solicitud incorrecta')
        .setPayload({
            errors: errors.array()
        })
        .build()
        return res.status(400).json(response)
    }
    next()
}

export const validateRegistrationData = [
    ...validateName,
    ...validateEmail,
    ...validatePassword,

    handleErrors
]

export const validateLoginData = [
    ...validateEmail,
    body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),

    handleErrors
]

export const validateForgotPasswordData = [
    ...validateEmail,
    handleErrors
]

export const validateResetPasswordData = [
    ...validatePassword,
    handleErrors
]

export const validateWorkspaceData = [
    ...validateWorkspaceName,
    ...validateChannelName, 
    handleErrors
]

export const validateWorkspaceUpdate = [
    ...validateWorkspaceName,
    handleErrors
]

export const validateChannelData = [
    ...validateChannelName,
    handleErrors
]

export const validateMessageData = [
    ...validateMessageContent,
    handleErrors
]