import User from "../models/user.model.js";
import Workspace from "../models/workspace.model.js"

class WorkspaceRepository {
        static async getById(id, userId) {
            return await Workspace.findOne({_id: id, members: userId})
                .populate("members", "name email")
                .populate("channels", "channelName")
        }

    static async getAllByUserId(userId) {
        return await Workspace.find({ members: userId })
            .populate("members", "name email")
            .populate("channels", "channelName")
    }

    static async create({ workspaceName, description, workspacePhoto, members = [], canales = [] }) {
        const workspace = new Workspace({
            workspaceName,
            description,
            workspacePhoto,
            members,
            canales,
        });
        return await workspace.save()
    }

    static async update(id, data) {
        return await Workspace.findByIdAndUpdate(id, data, { new: true })
            .populate("members", "name email")
            .populate("channels", "channelName")
    }

    static async delete(id) {
        return await Workspace.findByIdAndDelete(id)
    }

    static async addMember(workspaceId, userId, role = 'member') {
        const workspace = await this.getById(workspaceId)
        if (!workspace) {
            throw new Error("Workspace no encontrado")
        }
        
        if (workspace.members.includes(userId)) {
            throw new Error("El usuario ya es miembro del workspace")
        }
    
        workspace.members.push(userId)
        await workspace.save()
    
        const user = await User.getById(userId)
        if (!user) {
            throw new Error("Usuario no encontrado")
        }

        const isMember = user.workspaces.some(ws => ws.workspaceId.toString() === workspaceId.toString())
        if (!isMember) {
            user.workspaces.push({ workspaceId, role })
            await user.save()
        }
    
        return workspace
    }

    static async addChannel(workspaceId, channelId) {
        try {
            return await Workspace.findByIdAndUpdate(
                workspaceId,
                { $push: { channels: channelId } },
                { new: true }
            )
        } catch (error) {
            throw new Error("Error al añadir el canal al workspace: " + error.message)
        }
    }
}

export default WorkspaceRepository

