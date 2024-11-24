import transporter from "../config/transporter.config.js"
import ResponseBuilder from "./builders/responseBuilder.js"

const sendEmail = async (options) => {
    try{
        const response = await transporter.sendMail(options)
        console.log('Email enviado', response)
        return new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Email enviado exitosamente')
        .setPayload({
            responseId: response.messageId
        })
        .build()
        }
    catch(error){
        console.error('Error al enviar mail:', error)
        return new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage('Error al enviar el email')
        .setPayload({
            error: error.message
        })
        .build()
    }
    
}

export {sendEmail}