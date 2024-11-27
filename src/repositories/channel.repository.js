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

    static async create({ channelName, messages = [] }) {
        const channel = new Channel({
            channelName,
            messages,
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
