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

    static async create({ channel, authorId, content }) {
        const newMessage = new Message({
            channel,
            author: authorId,
            content
        })
        await newMessage.save()
        return await newMessage.populate('author', '_id name email photo')
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
