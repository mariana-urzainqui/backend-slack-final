import ENVIRONMENT from "../config/environment.config.js"
import { sendEmail } from "../utils/mail.util.js"

class EmailService {
    static async sendVerificationEmail(email, verificationToken) {
        try {
            const urlVerification = `${ENVIRONMENT.BASE_URL}/api/auth/verify/${verificationToken}`
            const logoUrl = 'https://res.cloudinary.com/dhz0yetjy/image/upload/v1732471134/slack-logo_wxamev.png'

            const htmlContent = `
            <div style="font-family: Arial, sans-serif; background-color: #EDFFD6; padding: 20px; width: 100%; max-width: 600px; margin: 0 auto;">
    <div style="padding: 20px; text-align: center;">
        <img src="${logoUrl}" alt="Logo" style="max-width: 150px; height: auto; border-radius: 8px;">
    </div>
    
    <div style="background-color: #191A23; padding: 20px; border-radius: 8px;">
        <div style="padding-bottom: 15px; border-bottom: 1px solid #222330; margin-bottom: 10px;">
            <h1 style="font-size: 20px; font-weight: 500; color: #F3F3F3; margin: 0;">
                Verificación de correo electrónico
            </h1>
        </div>
        
        <div style="background-color: #222330; border-radius: 8px; padding: 20px;">
            <p style="font-size: 16px; line-height: 1.5; color: #F3F3F3; margin: 0;">
                ¡Hola! Para confirmar tu cuenta, por favor haz clic en el siguiente botón:
            </p>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href="${urlVerification}" 
                style="display: inline-block; 
                        background-color: #b9ff66; 
                        color: #191A23; 
                        padding: 10px 20px; 
                        font-size: 16px; 
                        border-radius: 5px; 
                        text-decoration: none; 
                        font-weight: 500;">
                    Verificar correo
                </a>
            </div>
            
            <p style="font-size: 14px; color: #ABABC4; text-align: center; margin-top: 30px; margin-bottom: 0;">
                Si no solicitaste esta verificación, puedes ignorar este mensaje.
            </p>
        </div>
    </div>
    
    <div style="margin-top: 30px; text-align: center; color: #222330; font-size: 12px;">
        <p style="margin: 0;">
            Este es un mensaje automatizado, por favor no respondas.
        </p>
    </div>
</div>

            `
            await sendEmail({
                to: email,
                subject: "Valida tu correo electrónico",
                html: htmlContent,
            })

            console.log(`Correo de verificación enviado a ${email}`)
        } catch (error) {
            console.error("Error al enviar el correo de verificación:", error)
            throw new Error("No se pudo enviar el correo de verificación")
        }
    }

    static async sendPasswordResetEmail(email, resetToken) {
        try {
            const urlReset = `${ENVIRONMENT.BASE_URL}/reset-password/${resetToken}`

            const htmlContent = `
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
                        color: #FF5722; 
                        font-size: 24px; 
                        text-align: center;
                    ">Restablecimiento de contraseña</h1>
                    <p style="
                        font-size: 16px; 
                        line-height: 1.5; 
                        text-align: center;
                        margin: 20px 0;
                    ">
                    Haga clic en el botón de abajo para restablecer su contraseña.
                    </p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="${urlReset}" style="
                            display: inline-block;
                            background-color: #FF5722; 
                            color: white;
                            padding: 10px 20px;
                            font-size: 16px;
                            border-radius: 5px;
                            text-decoration: none;">
                            Restablecer contraseña
                        </a>
                    </div> 
                    <p style="
                        font-size: 14px; 
                        color: #777; 
                        text-align: center; 
                        margin-top: 30px;
                    ">
                        Si no solicitaste este restablecimiento, puedes ignorar este mensaje.
                    </p>
                </div>
            `

            await sendEmail({
                to: email,
                subject: "Restablecimiento de contraseña",
                html: htmlContent,
            })

            console.log(`Correo de restablecimiento enviado a ${email}`)
        } catch (error) {
            console.error("Error al enviar el correo de restablecimiento:", error)
            throw new Error("No se pudo enviar el correo de restablecimiento")
        }
    }
}

export default EmailService


