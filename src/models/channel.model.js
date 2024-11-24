import mongoose from "mongoose"

const channelSchema = new mongoose.Schema({
    nombreCanal: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }]
})

const Channel = mongoose.model('Channel', channelSchema)

export default Channel