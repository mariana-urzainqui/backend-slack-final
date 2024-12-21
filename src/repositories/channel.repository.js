import Channel from "../models/channel.model.js"

class ChannelRepository {
    static async getById(id) {
        return await Channel.findById(id)
        .populate({
            path: "messages", 
            select: "content createdAt author", 
            populate: {
                path: "author",  
                select: "name email photo"  
            }
        })
    }

    static async getAll() {
        return await Channel.find()
            .populate("messages", "content createdAt author")
    }

    static async getAllByWorkspaceId(workspaceId) {
        try {
            return await Channel.find({ workspaceId })
                .populate("messages", "content createdAt author");
        } 
        catch (error) {
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

    static async removeMessageFromChannel(channelId, messageId) {
        const channel = await Channel.findById(channelId)
        if (!channel) {
            throw new Error("Canal no encontrado")
        }
        channel.messages = channel.messages.filter(message => message.toString() !== messageId.toString())
        await channel.save()
    }
}

export default ChannelRepository
