import ChannelRepository from "../repositories/channel.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import ResponseBuilder from "../utils/builders/responseBuilder.js"

export const getAllWorkspacesController = async (req, res) => {
    const userId = req.user.id
    try {
        const workspaces = await WorkspaceRepository.getAllByUserId(userId)
        if (!workspaces || workspaces.length === 0) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('No se encontraron workspaces.')
                .setPayload({
                    workspaces: [],
                    detail: 'El usuario no pertenece a ningún workspace.'
                })
                .build()
            return res.status(404).json(response)

        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Workspaces obtenidos exitosamente')
            .setPayload({ workspaces })
            .build()
        return res.status(200).json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al obtener los workspaces')
            .setPayload({ error: error.message })
            .build()
        return res.status(500).json(response)
    }
}

export const createWorkspaceController = async (req, res) => {
    const { workspaceName, channelName } = req.body
    const userId = req.user.id

    try {
        if (!userId) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('ID de usuario no válido')
                .setPayload({
                    error: 'El usuario logueado no tiene un ID válido'
                })
                .build()
            return res.status(400).json(response)
        }
        const newChannel = await ChannelRepository.create({
            channelName: channelName
        })

        const newWorkspace = await WorkspaceRepository.create({
            workspaceName,
            members: [userId],
            channels: [newChannel._id]
        })

        const updatedUser = await UserRepository.addWorkspace(userId, {
            workspaceId: newWorkspace._id,
            role: 'creator'
        })
        if (!updatedUser) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(500)
                .setMessage('Error al actualizar el usuario con el workspace')
                .setPayload({
                    detail: 'Hubo un error al actualizar el usuario con el workspace'
                })
                .build()
            return res.status(500).json(response)
        }
        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Espacio de trabajo creado con éxito')
            .setPayload({ workspace: newWorkspace })
            .build()
        return res.status(201).json(response)
    }
    catch (error) {
        console.error(error)
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al crear el espacio de trabajo')
            .setPayload({ error: error.message })
            .build()
        return res.status(500).json(response)
    }
}

export const getWorkspaceByIdController = async (req, res) => {
    const { workspace_id } = req.params
    const userId = req.user.id
    try {
        const workspace = await WorkspaceRepository.getById(id, userId)

        if (!workspace) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Espacio de trabajo no encontrado o no autorizado.')
                .setPayload({
                    detail: 'No se pudo encontrar el workspace con el ID proporcionado para este usuario.'
                })
                .build()
            return res.status(404).json(response)
        }

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Espacio de trabajo encontrado')
            .setPayload({ workspace })
            .build()
        return res.status(200).json(response)
    }
    catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al obtener el espacio de trabajo')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}

export const updateWorkspaceController = async (req, res) => {
    const { workspace_id } = req.params
    const { workspaceName, members } = req.body
    const userId = req.user.id

    try {
        const workspace = await WorkspaceRepository.getById(id)

        if (!workspace) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Espacio de trabajo no encontrado')
                .setPayload({
                    detail: 'No se pudo encontrar el workspace con el ID proporcionado.'
                })
                .build();
            return res.status(404).json(response)
        }
        const user = await UserRepository.getByIdWithWorkspaces(userId)
        const userWorkspace = user.workspaces.find(
            (workspaceEntry) => workspaceEntry.workspaceId.toString() === id
        )
        if(!userWorkspace || userWorkspace.role != 'creator'){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('Acceso denegado')
            .setPayload({
                detail: 'No tienes permisos para actualizar este workspace'
            })
            .build()
            return res.status(403).json(response)
        }

        const updatedWorkspace = await WorkspaceRepository.update(id, {
            workspaceName: workspaceName || workspace.workspaceName,
            members: members || workspace.members
        })

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Espacio de trabajo actualizado con éxito')
            .setPayload({
                workspace: updatedWorkspace
            })
            .build()
        return res.status(200).json(response)

    } catch (error) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al actualizar el espacio de trabajo')
            .setPayload({
                detail: error.message
            })
            .build()
        return res.status(500).json(response)
    }
}



export const deleteWorkspaceController = async (req, res) => {
    const { workspace_id } = req.params
    const userId = req.user.id

    try{
        const workspace = await WorkspaceRepository.getById(id)

        if(!workspace){
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Espacio de trabajo no encontrado')
                .setPayload({
                    detail: 'No se pudo encontrar el workspace con el ID proporcionado.'
                })
                .build()
            return res.status(404).json(response)
        }

        const user = await UserRepository.getByIdWithWorkspaces(userId)
        const userWorkspace = user.workspaces.find(
            (workspaceEntry) => workspaceEntry.workspaceId.toString() === id
        )
        if(!userWorkspace || userWorkspace.role != 'creator'){
            const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('Acceso denegado')
            .setPayload({
                detail: 'No tienes permisos para actualizar este workspace'
            })
            .build()
            return res.status(403).json(response)
        }
        
        await WorkspaceRepository.delete(id)

        await UserRepository.removeWorkspace(userId, id)

        const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('Espacio de trabajo eliminado con éxito')
        .setPayload({
            detail: `El workspace con ID ${id} fue eliminado`
        })
        .build()
        return res.status(200).json(response)
    }
    catch(error){
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error al eliminar el espacio de trabajo')
            .setPayload({ detail: error.message })
            .build()
        return res.status(500).json(response)
    }
}