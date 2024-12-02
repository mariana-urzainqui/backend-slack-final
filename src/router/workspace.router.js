import express from 'express'
import { 
    createWorkspaceController, 
    deleteWorkspaceController, 
    getAllWorkspacesController, 
    getWorkspaceByIdController, 
    updateWorkspaceController 
} from '../controllers/workspace.controller.js'
import { validateWorkspaceData, validateWorkspaceUpdate } from '../middlewares/validation.middleware.js'
import { verifyTokenMiddleware, verifyWorkspaceCreatorMiddleware } from '../middlewares/auth.middleware.js'

const workspaceRouter = express.Router()

workspaceRouter.get('/', verifyTokenMiddleware(), getAllWorkspacesController)
workspaceRouter.post('/create', verifyTokenMiddleware(), validateWorkspaceData, createWorkspaceController)
workspaceRouter.get('/:workspace_id', verifyTokenMiddleware(), getWorkspaceByIdController)
workspaceRouter.put('/:workspace_id', verifyTokenMiddleware(), verifyWorkspaceCreatorMiddleware, validateWorkspaceUpdate, updateWorkspaceController)
workspaceRouter.delete('/:workspace_id', verifyTokenMiddleware(), verifyWorkspaceCreatorMiddleware, deleteWorkspaceController)

export default workspaceRouter