import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'https://res.cloudinary.com/dhz0yetjy/image/upload/v1732470874/default-user-image_ixrah8.jpg'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: true
    },
    workspaces: [{
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true
        },
        role: {
            type: String,
            enum: ['creator', 'member'],
            default: 'member'
        }
    }]
})

const User = mongoose.model('User', userSchema)

export default User