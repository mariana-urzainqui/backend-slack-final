import WorkspaceRepository from "../repositories/workspace.repository.js";
import ResponseBuilder from "../utils/builders/responseBuilder.js";


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
        if (workspace.members.includes(userIdToAdd)) {
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

}
export const getMembersOfWorkspaceController = async (req, res) => {

}