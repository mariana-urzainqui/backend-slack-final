import express from 'express'
import { 
    createWorkspaceController, 
    deleteWorkspaceController, 
    getAllWorkspacesController, 
    getWorkspaceByIdController, 
    updateWorkspaceController 
} from '../controllers/workspace.controller.js'
import { validateWorkspaceData } from '../middlewares/validation.middleware.js'
import { verifyTokenMiddleware } from '../middlewares/auth.middleware.js'

const workspaceRouter = express.Router()

workspaceRouter.get('/', verifyTokenMiddleware(), getAllWorkspacesController)
workspaceRouter.post('/create', verifyTokenMiddleware(), validateWorkspaceData, createWorkspaceController)
workspaceRouter.get('/:id', verifyTokenMiddleware(), getWorkspaceByIdController)
workspaceRouter.put('/:id', verifyTokenMiddleware(), updateWorkspaceController)
workspaceRouter.delete('/:id', verifyTokenMiddleware(), deleteWorkspaceController)

export default workspaceRouter