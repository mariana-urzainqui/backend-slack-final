import Channel from "../models/channel.model.js"

class ChannelRepository {
    static async getById(id) {
        return await Channel.findById(id)
            .populate("messages", "content createdAt author") 
            .populate("author", "name email")
    }

    static async getAll() {
        return await Channel.find()
            .populate("messages", "content createdAt author")
    }

    static async getAllByWorkspaceId(workspaceId) {
        try {
            return await Channel.find({ workspaceId })
                .populate("messages", "content createdAt author");
        } catch (error) {
            throw new Error("Error al obtener los canales para este workspace: " + error.message)
        }
    }

    static async create({ channelName, messages = [], workspaceId }) {
        const channel = new Channel({
            channelName,
            messages,
            workspaceId  
        })
        return await channel.save()
    }

    static async update(id, data) {
        return await Channel.findByIdAndUpdate(id, data, { new: true })
            .populate("messages", "content createdAt author")
    }

    static async delete(id) {
        return await Channel.findByIdAndDelete(id)
    }
}

export default ChannelRepository
