import WorkspaceRepository from "../repositories/workspace.repository.js"
import ResponseBuilder from "../utils/builders/responseBuilder.js"


export const addMemberToWorkspaceController = async (req, res) => {
    const { workspace_id } = req.params
    const { userIdToAdd } = req.body

    try {
        const workspace = await WorkspaceRepository.getById(workspace_id, req.user.id)
        if (!workspace) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Workspace no encontrado')
                .setPayload({
                    detail: 'No se encontró el workspace con el ID proporcionado.'
                })
                .build()
            return res.status(404).json(response)
        }
        const isMember = workspace.members.some(member => 
            member._id.toString() === userIdToAdd
        )

        if (isMember) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('El usuario ya es miembro del workspace')
                .setPayload({
                    detail: `El usuario con ID ${userIdToAdd} ya es miembro del workspace.`
                })
                .build()
            return res.status(400).json(response)
        }

        const updatedWorkspace = await WorkspaceRepository.addMember(workspace_id, userIdToAdd)

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(201)
            .setMessage('Usuario añadido al workspace correctamente')
            .setPayload({ 
                workspace: updatedWorkspace 
            })
            .build()
        return res.status(201).json(response)
    } 
    catch (error) {
        console.error('Error al añadir miembro al workspace:', error)
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


export const removeMemberFromWorkspaceController = async (req, res) =>{
    const { workspace_id, user_id } = req.params

    try {
        const workspace = await WorkspaceRepository.getById(workspace_id, req.user.id)
        console.log('Workspace members', workspace.members)
        if (!workspace) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Workspace no encontrado')
                .setPayload({
                    detail: 'No se encontró el workspace con el ID proporcionado.'
                })
                .build()
            return res.status(404).json(response)
        }

        const isMember = workspace.members.some(member => 
            member._id.toString() === user_id
        )

        if (!isMember) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(400)
                .setMessage('El usuario no es miembro del workspace')
                .setPayload({
                    detail: `El usuario con ID ${user_id} no pertenece al workspace.`
                })
                .build()
            return res.status(400).json(response)
        }


        await WorkspaceRepository.removeMember(workspace_id, user_id)

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Usuario eliminado del workspace correctamente')
            .setPayload({
                detail: `El usuario con ID ${user_id} fue eliminado del workspace con ID ${workspace_id}.`
            })
            .build()
        return res.status(200).json(response)
    } 
    catch (error) {
        console.error('Error al eliminar miembro del workspace:', error)

        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(500)
            .setMessage('Error interno del servidor')
            .setPayload({
                detail: error.message,
            })
            .build()
        return res.status(500).json(response)
    }
}

export const getMembersOfWorkspaceController = async (req, res) => {
    const { workspace_id } = req.params

    try {
        const workspace = await WorkspaceRepository.getById(workspace_id, req.user.id)
        
        if (!workspace) {
            const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(404)
                .setMessage('Workspace no encontrado')
                .setPayload({
                    detail: 'No se encontró el workspace con el ID proporcionado.'
                })
                .build()
            return res.status(404).json(response)
        }

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage('Miembros obtenidos exitosamente')
            .setPayload({
                members: workspace.members
            })
            .build()
        return res.status(200).json(response)
    } 
    catch (error) {
        console.error('Error al obtener miembros del workspace:', error)

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