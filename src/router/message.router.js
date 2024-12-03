import express from 'express'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'
import { validateMessageData } from '../middlewares/validation.middleware.js'
import { 
    createMessageController,
    deleteMessageController, 
    getMessagesByChannelController, 
} from '../controllers/message.controller.js'

const messageRouter = express.Router()

messageRouter.get('/:channel_id', verifyTokenMiddleware(), getMessagesByChannelController)
messageRouter.post('/:channel_id/create', verifyTokenMiddleware(), validateMessageData, createMessageController)
messageRouter.delete('/:message_id/delete', verifyTokenMiddleware(), deleteMessageController)

export default messageRouter