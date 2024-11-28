import express from 'express'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'
import { validateMessageData } from '../middlewares/validation.middleware.js'
import { 
    createMessageController,
    deleteMessageController, 
    getMessagesByChannelController, 
    updateMessageController 
} from '../controllers/message.controller.js'

const messageRouter = express.Router()

messageRouter.get('/:channel_id', verifyTokenMiddleware(), getMessagesByChannelController)
messageRouter.post('/:channel_id/create', verifyTokenMiddleware(), validateMessageData, createMessageController)
messageRouter.put('/:message_id', verifyTokenMiddleware(), updateMessageController)
messageRouter.delete('/:message_id', verifyTokenMiddleware(), deleteMessageController)

export default messageRouter