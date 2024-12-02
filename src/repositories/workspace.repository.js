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

    static async addMember(workspaceId, userId) {
        const workspace = await this.getById(workspaceId)
        if (!workspace) {
            throw new Error("Workspace no encontrado")
        }
        if (workspace.members.includes(userId)) {
            throw new Error("El usuario ya es miembro del workspace")
        }
        workspace.members.push(userId)
        return await workspace.save()
    }

    static async addChannel(workspaceId, channelId) {
        const workspace = await this.getById(workspaceId)
        if (!workspace) {
            throw new Error("Workspace no encontrado")
        }
        if (workspace.canales.includes(channelId)) {
            throw new Error("El canal ya está asociado al workspace")
        }
        workspace.canales.push(channelId)
        return await workspace.save()
    }
}

export default WorkspaceRepository

