import ChannelRepository from "../repositories/channel.repository.js"
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
            .setPayload({workspaces})
            .build()
        return res.status(200).json(response)
    }
    catch(error) {
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
    console.log(userId)
    try{
        if(!userId){
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

        const response = new ResponseBuilder()
                .setOk(true)
                .setStatus(201)
                .setMessage('Espacio de trabajo creado con éxito')
                .setPayload({workspace: newWorkspace})
                .build()
            return res.status(201).json(response)
    }
    catch(error){
        console.error(error)
        const response = new ResponseBuilder()
                .setOk(false)
                .setStatus(500)
                .setMessage('Error al crear el espacio de trabajo')
                .setPayload({error: error.message})
                .build()
            return res.status(500).json(response)
    }
}

export const getWorkspaceByIdController = async (req, res) => {
    const {id} = req.params
    const userId = req.user.id
    try{
        const workspace = await WorkspaceRepository.getById(id, userId)

        if(!workspace){
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
                .setPayload({workspace})
                .build()
            return res.status(200).json(response)
    }
    catch(error){
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


//PENDIENTE CHEQUEAR QUE ESTE OK Y APARTE FALTA USER ID Y DEMAS 
export const updateWorkspaceController = async (req, res) => {
    const { id } = req.params
    const { workspaceName, members } = req.body

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

}