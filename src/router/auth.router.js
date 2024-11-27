import express from "express"
import { 
    forgotPasswordController, 
    loginController, 
    registerUserController, 
    resetTokenController, 
    verifyMailValidationTokenController 
} from '../controllers/auth.controller.js'
import { 
    validateForgotPasswordData, 
    validateLoginData, 
    validateRegistrationData, 
    validateResetPasswordData
} from "../middlewares/validation.middleware.js"

const authRouter = express.Router()
    
authRouter.post('/register', validateRegistrationData, registerUserController )
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)
authRouter.post('/login', validateLoginData, loginController)
authRouter.post('/forgot-password', validateForgotPasswordData, forgotPasswordController)
authRouter.put('/reset-password/:reset_token', validateResetPasswordData, resetTokenController)

export default authRouter