import mongoose from "mongoose"

const workspaceSchema = new mongoose.Schema({
    workspaceName: {
        type: String,
        required: true
    },
    workspacePhoto: {
        type: String,
        required: true,
        default: 'https://res.cloudinary.com/dhz0yetjy/image/upload/v1732718249/default-workspace.image_ezra4h.webp'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    }]
})

const Workspace = mongoose.model('Workspace', workspaceSchema)

export default Workspace