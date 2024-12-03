import express from 'express'
import { addMemberToWorkspaceController, getMembersOfWorkspaceController, removeMemberFromWorkspaceController } 
from '../controllers/member.controller.js'
import { verifyTokenMiddleware, verifyWorkspaceCreatorMiddleware } from '../middlewares/auth.middleware.js'

const memberRouter = express.Router()

memberRouter.post('/:workspace_id/member', verifyTokenMiddleware(), verifyWorkspaceCreatorMiddleware, addMemberToWorkspaceController)   
memberRouter.delete('/:workspace_id/member/:user_id', verifyTokenMiddleware(), verifyWorkspaceCreatorMiddleware, removeMemberFromWorkspaceController)
memberRouter.get('/:workspace_id/members', verifyTokenMiddleware(), getMembersOfWorkspaceController)

export default memberRouter