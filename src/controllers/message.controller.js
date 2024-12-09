import ChannelRepository from "../repositories/channel.repository.js"
import MessageRepository from "../repositories/message.repository.js"
import ResponseBuilder from "../utils/builders/responseBuilder.js"

export const getMessagesByChannelController = async (req, res) => {
    const { channel_id } = req.params

    try{
        const channel = await ChannelRepository.getById(channel_id)
        if(!channel){
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Canal no encontrado')
                .build()
            return res.status(404).json(response)
        }

        const messages = channel.messages

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Mensajes obtenidos correctamente')
            .setPayload({ messages })
            .build();

        return res.status(200).json(response)
    }
    catch(error){
        console.error('Error al obtener los mensajes del canal:', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}

export const createMessageController = async (req, res) => {
    const { channel_id } = req.params
    const { content } = req.body
    const userId = req.user.id

    try { 
        const channel = await ChannelRepository.getById(channel_id)
        if (!channel) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Canal no encontrado')
                .build()
            return res.status(404).json(response)
        }

        const message = await MessageRepository.create({
            channel: channel_id,
            authorId: userId,
            content: content
        })

        channel.messages.push(message._id)
        await channel.save()

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Mensaje creado exitosamente')
            .setPayload({ message })
            .build()
        return res.status(201).json(response)
    } 
    catch (error) {
        console.error('Error al crear el mensaje:', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.status(500).json(response)
    }
} 


export const deleteMessageController = async (req, res) => {
    const { message_id } = req.params
    const userId = req.user.id

    try {
        const message = await MessageRepository.getById(message_id)
        if (!message) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Mensaje no encontrado')
                .setPayload({
                    detail: 'No se encontro un mensaje con el ID proporcionado'
                })
                .build()
            return res.status(404).json(response)
        }

        if (message.author._id.toString() !== userId.toString()) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('No tienes permiso para eliminar este mensaje')
                .setPayload({
                    detail: 'El mensaje no fue eliminado porque no eres el autor del mismo'
                })
                .build()
            return res.status(403).json(response)
        }

        await MessageRepository.delete(message_id)

        await ChannelRepository.removeMessageFromChannel(message.channel, message._id)

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Mensaje eliminado exitosamente')
            .build()
        return res.status(200).json(response)
    } 
    catch (error) {
        console.error('Error al eliminar el mensaje:', error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({
                error: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}