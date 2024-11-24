import express from "express"
import { 
    forgotPasswordController, 
    loginController, 
    registerUserController, 
    resetTokenController, 
    verifyMailValidationTokenController 
} from '../controllers/auth.controller.js'
import { validateLoginData, validateRegistrationData } from "../middlewares/validation.middleware.js"



const authRouter = express.Router()

//Endpoints
authRouter.post('/register', validateRegistrationData, registerUserController )
authRouter.get('/verify/:verification_token', verifyMailValidationTokenController)
authRouter.post('/login', validateLoginData, loginController)
authRouter.post('/forgot-password', forgotPasswordController)
authRouter.put('/reset-password/:reset_token', resetTokenController)

export default authRouter