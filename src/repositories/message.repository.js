import Message from "../models/message.model.js"

class MessageRepository {

    static async getAllByChannelId(channelId) {
        return await Message.find({ channelId })
            .populate("author", "name email") 
            .sort({ createdAt: 1 })
    }

    static async getById(id) {
        return await Message.findById(id)
            .populate("author", "name email")
    }

    static async create({ channelId, authorId, content }) {
        const newMessage = new Message({
            channelId,
            author: authorId,
            content
        })
        return await newMessage.save()
    }

    static async update(id, data) {
        return await Message.findByIdAndUpdate(id, data, { new: true })
            .populate("author", "name email")
    }

    static async delete(id) {
        return await Message.findByIdAndDelete(id)
    }
}

export default MessageRepository
