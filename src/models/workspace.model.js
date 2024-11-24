import mongoose from "mongoose"

const workspaceSchema = new mongoose.Schema({
    workspaceName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    workspacePhoto: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    canales: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    }]
})

const Workspace = mongoose.model('Workspace', workspaceSchema)

export default Workspace