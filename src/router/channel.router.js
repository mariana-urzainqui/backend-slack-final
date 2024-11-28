import express from 'express'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'
import {
    createChannelController,
    deleteChannelController,
    getAllChannelsController,
    getChannelByIdController,
    updateChannelController,
} from '../controllers/channel.controller.js'
import { validateChannelData } from '../middlewares/validation.middleware.js'

const channelRouter = express.Router()

channelRouter.get('/:workspace_id', verifyTokenMiddleware(), getAllChannelsController)
channelRouter.post('/:workspace_id/create', verifyTokenMiddleware(), validateChannelData, createChannelController)
channelRouter.get('/:channel_id', verifyTokenMiddleware(), getChannelByIdController)
channelRouter.put('/:channel_id', verifyTokenMiddleware(), validateChannelData, updateChannelController)
channelRouter.delete('/:channel_id', verifyTokenMiddleware(), deleteChannelController)

export default channelRouter