import mongoose from "mongoose"

const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',  
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