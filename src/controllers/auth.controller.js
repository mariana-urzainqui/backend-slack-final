import ENVIRONMENT from "../config/environment.config.js"
import User from "../models/user.model.js"
import ResponseBuilder from "../utils/builders/responseBuilder.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { sendEmail } from "../utils/mail.util.js"
import UserRepository from "../repositories/user.repository.js"
import EmailService from "../services/email.service.js"



export const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (await UserRepository.isEmailInUse(email)) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload(
                    {
                        errors: {
                            email: 'El email ya esta en uso'
                        }
                    }
                )
                .build()
            return res.status(400).json(response)
        }

        const user = await UserRepository.createUser({ name, email, password })

        await EmailService.sendVerificationEmail(user.email, user.verificationToken)
        console.log(`Usuario registrado y correo enviado a: ${user.email}`)

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Usuario creado con éxito')
            .setPayload({ user: user })
            .build()
        return res.status(201).json(response)
    }
    catch (error) {
        console.error('Error al registrar usuario', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Internal server error')
            .setPayload(
                {
                    detail: error.message
                }
            )
            .build()
        return res.status(500).json(response)
    }
}

export const verifyMailValidationTokenController = async (req, res) => {
    try {
        const { verification_token } = req.params

        if (!verification_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Falta enviar token')
                .setPayload({
                    'detail': 'El token de verificación no fue proporcionado'
                })
                .build()
            return res.status(400).json(response)
        }
        let decoded
        try {
            decoded = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET)
        }
        catch(error){
            console.error('Error al verificar el token:', error)
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Token inválido o expirado')
                .setPayload({
                    detail: 'El token de verificación no es válido o ha expirado.'
                })
                .build()
            return res.status(400).json(response)
        }
        
        const user = await UserRepository.getByEmail(decoded.email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Usuario no encontrado')
                .setPayload({
                    detail: 'No se econtró un usuario con el correo especificado'
                })
                .build()
            return res.status(404).json(response)
        }
        if (user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Correo ya verificado')
                .setPayload({
                    detail: 'Este correo electrónico ya ha sido verificado'
                })
                .build()
            return res.status(400).json(response)
        }
    
        if (user.verificationToken !== verification_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Token invalido')
                .setPayload({
                    detail: 'El token de verificacion no coincide con el almacenado'
                })
                .build()
            return res.status(400).json(response)
        }
        
        await UserRepository.setEmailVerified(true, user._id)

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Email verificado con éxito')
            .setPayload({
                message: 'El usuario ha sido validado correctamente'
            })
            .build()
        return res.status(200).json(response)
    }
    catch (error) {
        console.error('Error al verificar el email:', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({
                detail: 'Ocurrio un error al verificar el correo electronico'
            })
            .build()
        return res.status(500).json(response)
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await UserRepository.obtenerPorEmail(email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Credenciales inválidas')
                .setPayload({
                    errors: {
                        general: 'Email o contraseña incorrectos'
                    }
                })
                .build()
            return res.status(401).json(response)
        }
        if (!user.emailVerified) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('Email no verificado')
                .setPayload({
                    errors: {
                        email: 'Por favor, verifica tu email antes de iniciar sesión'
                    }
                })
                .build()
            return res.status(403).json(response)
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(401)
                .setMessage('Credenciales inválidad')
                .setPayload({
                    errors: {
                        general: 'Email o contraseña incorrectos'
                    }
                })
                .build()
            return res.status(401).json(response)
        }
        
        const token = jwt.sign(
            {
                email: user.email,
                id: user._id,
                role: user.role
            },
            ENVIRONMENT.JWT_SECRET,
            { expiresIn: '1d' }
        )
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Inicio de sesión exitoso')
            .setPayload({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
            .build()
        return res.status(200).json(response)
    }
    catch (error) {
        console.error('Error en el login:', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({
                errors: {
                    general: 'Hubo un problema al procesar la solicitud'
                }
            })
            .build()
        return res.status(500).json(response)
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad Request')
                .setPayload({
                    errors: {
                        email: 'El email es requerido'
                    }
                })
                .build()
            return res.status(400).json(response)
        }
        const user = await UserRepository.obtenerPorEmail(email)
        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Usuario no encontrado')
                .setPayload({
                    errors: {
                        email: 'No se encontro un usuario registrado con el correo proporcionado'
                    }
                })
                .build()
            return res.status(404).json(response)
        }
        const resetToken = jwt.sign({ email: user.email }, ENVIRONMENT.JWT_SECRET, {
            expiresIn: '1h'
        })
        const resetUrl = `${ENVIRONMENT.URL_FRONT}/reset-password/${resetToken}`
        sendEmail({
            to: user.email,
            subject: 'Restablecer contraseña',
            html: `
    <div style="
        font-family: Arial, sans-serif;
        color: #333;
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
    ">
        <h1 style="
            color: #4CAF50;
            font-size: 24px;
            text-align: center;
        ">Solicitud para restablecer contraseña</h1>
        <p style="
            font-size: 16px;
            line-height: 1.5;
            text-align: center;
            margin: 20px 0;
        ">
            Has solicitado restablecer tu contraseña. Haz clic en el enlace de abajo para continuar con el proceso:
        </p>
        <div style="text-align: center; margin-top: 20px;">
            <a href='${resetUrl}' style="
                display: inline-block;
                background-color: #333;
                color: #fff;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                text-decoration: none;
            ">
                Restablecer contraseña
            </a>
        </div>
        <p style="
            font-size: 14px;
            color: #777;
            text-align: center;
            margin-top: 30px;
        ">
            Si no solicitaste este cambio, ignora este mensaje.
        </p>
    </div>
    `
        })
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Se envio el correo')
            .setPayload({
                detail: 'Se envio un correo electronico con las instrucciones para restablecer tu contraseña'
            })
            .build()
        return res.status(200).json(response)

    }
    catch (error) {
        console.error('Error en el proceso de restablecimiento de contraseña', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({
                errors: {
                    general: 'Ocurrió un error al procesar la solicitud de restablecimiento'
                }
            })
            .build()
        return res.status(500).json(response)
    }
}

export const resetTokenController = async (req, res) => {
    try {
        const { password } = req.body
        const { reset_token } = req.params
        if (!password || password.length < 8) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Bad request')
                .setPayload({
                    detail: 'La contraseña debe tener al menos 8 caracteres'
                })
                .build()
            return res.status(400).json(response)
        }
        if (!reset_token) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Token incorrecto')
                .setPayload({
                    detail: 'El reset token expiro o no es valido'
                })
                .build()
            return res.json(response)
        }

        const decoded = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET)
        if (!decoded) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('Token Incorrecto')
                .setPayload({
                    detail: 'Fallo token de verificacion'
                })
                .build()
            return res.json(response)
        }

        const { email } = decoded

        const user = await UserRepository.obtenerPorEmail(email)

        if (!user) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('No se encontro el usuario')
                .setPayload({
                    detail: 'Usuario inexistente o invalido'
                })
                .build()
            return res.json(response)
        }

        await UserRepository.updatePassword(user, password)

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Contraseña restablecida')
            .setPayload({
                detail: 'Se actualizo la contraseña correctamente'
            })
        return res.status(200).json(response)
    }
    catch (error) {
        console.error('Error al restablecer la contraseña:', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({
                detail: 'Ocurrió un error al intentar restablecer la contraseña'
            })
            .build()
        return res.status(500).json(response)
    }
}

