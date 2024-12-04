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
        const workspace = await Workspace.findById(workspaceId)
        workspace.members.push(userId)
        await workspace.save()
    
        const user = await User.findById(userId)
        user.workspaces.push({ workspaceId, role })
        await user.save()
    
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

