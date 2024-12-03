import ChannelRepository from "../repositories/channel.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import ResponseBuilder from "../utils/builders/responseBuilder.js"

export const getAllChannelsController = async (req, res) => {
    const { workspace_id } = req.params

    try {
        const channels = await ChannelRepository.getAllByWorkspaceId(workspace_id)

        if (!channels || channels.length === 0) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('No se encontraron canales en este espacio de trabajo.')
                .setPayload({
                    channels: [],
                    detail: 'Este workspace no tiene canales asociados.'
                })
                .build()
            return res.status(404).json(response)
        }

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Canales obtenidos exitosamente')
            .setPayload({ channels })
            .build();
        return res.status(200).json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al obtener los canales')
            .setPayload({ error: error.message })
            .build()
        return res.status(500).json(response)
    }
}

export const createChannelController = async (req, res) => {
    const { channelName } = req.body
    const { workspace_id } = req.params
    const userId = req.user.id
    try {
        const workspace = await WorkspaceRepository.getById(workspace_id, userId)
        if (!workspace) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Workspace no encontrado')
                .setPayload({
                    detail: 'No se encontró el workspace al que se intentó asociar el canal.',
                })
                .build()
            return res.status(404).json(response)
        }

        const newChannel = await ChannelRepository.create({
            channelName,
            workspaceId: workspace_id
        })

        await WorkspaceRepository.addChannel(workspace_id, newChannel._id)

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Canal creado con éxito')
            .setPayload({ channel: newChannel })
            .build()
        return res.status(201).json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al crear el canal')
            .setPayload({ error: error.message })
            .build()
        return res.status(500).json(response)
    }
}

export const getChannelByIdController = async (req, res) => {
    const { channel_id } = req.params

    try {
        const channel = await ChannelRepository.getById(channel_id)
        if (!channel) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Canal no encontrado')
                .setPayload({
                    detail: 'No se encontró el canal con el ID proporcionado.'
                })
                .build()
            return res.status(404).json(response)
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Canal encontrado')
            .setPayload({ channel })
            .build();
        return res.status(200).json(response);
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al obtener el canal')
            .setPayload({ error: error.message })
            .build();
        return res.status(500).json(response);
    }
}

export const updateChannelController = async (req, res) => {
    const { channel_id } = req.params
    const { channelName } = req.body
    const { workspace_id } = req.params

    try {
        const channel = await ChannelRepository.getById(channel_id)
        if (!channel) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Canal no encontrado')
                .setPayload({
                    detail: 'No se encontró el canal con el ID proporcionado.'
                })
                .build()
            return res.status(404).json(response)
        }

        if (channel.workspaceId.toString() !== workspace_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(403)
                .setMessage('Acceso denegado')
                .setPayload({
                    detail: 'El canal no pertenece al workspace indicado.'
                })
                .build()
            return res.status(403).json(response)
        }
        channel.channelName = channelName || channel.channelName
        const updatedChannel = await channel.save()
        
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Canal actualizado con éxito')
            .setPayload({ channel: updatedChannel })
            .build()
        return res.status(200).json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al actualizar el canal')
            .setPayload({ error: error.message })
            .build()
        return res.status(500).json(response)
    }
}

export const deleteChannelController = async (req, res) => {
    const { workspace_id, channel_id } = req.params
    try {
        const channel = await ChannelRepository.getById(channel_id)
        if (!channel || channel.workspaceId.toString() !== workspace_id) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Canal no encontrado o no pertenece al workspace')
                .setPayload({
                    detail: 'El canal no pertenece al workspace o no existe.'
                })
                .build();
            return res.status(404).json(response)
        }

        await ChannelRepository.delete(channel_id)

        await WorkspaceRepository.update(workspace_id, {
            $pull: { channels: channel_id }
        })

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Canal eliminado con éxito')
            .setPayload({
                detail: `El canal con ID ${channel_id} fue eliminado`
            })
            .build();
        return res.status(200).json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al eliminar el canal')
            .setPayload({ error: error.message })
            .build()
        return res.status(500).json(response)
    }
}


