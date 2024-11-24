/* Logica de configuracion de nuestro email */
import nodemailer from 'nodemailer'
import ENVIRONMENT from './environment.config.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENVIRONMENT.GMAIL_USER,
        pass: ENVIRONMENT.GMAIL_PASS
    }
})

export default transporter